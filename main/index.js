var { app, ipcMain, globalShortcut } = require('electron')
var audio = require('./audio')
var menu = require('./menu')
var player = require('./player')
var Config = require('electron-config')
var xtend = require('xtend')

var persist = new Config({ name: 'hyperamp-persist' })

var state = xtend({
  playlist: [],
  current: {},
  volume: 50,
  playing: false,
  muted: false
}, persist.store)

module.exports = state

app.on('ready', () => {
  menu.init()
  audio.init()
  player.init()

  var windows = [player, audio]
  function broadcast (/* args */) {
    var args = [].slice.call(arguments, 0)
    windows.forEach((winObj) => {
      if (winObj.win) winObj.win.send.apply(winObj.win, args)
    })
  }

  function volume (ev, level) {
    // player -> audio
    state.volume = level
    if (audio.win) audio.win.send('volume', level)
  }

  ipcMain.on('volume', volume)

  function playlist (ev, playlist) {
    // player -> main
    state.playlist = playlist
  }

  ipcMain.on('playlist', playlist)

  function queue (ev, meta) {
    state.current = meta
    broadcast('queue', meta)
  }

  ipcMain.on('queue', queue)

  function play () {
    state.playing = true
    broadcast('play')
  }

  ipcMain.on('play', play)

  function pause () {
    state.playing = false
    broadcast('pause')
  }

  ipcMain.on('pause', pause)

  function playPause () {
    state.playing ? pause() : play()
  }

  function prev () {
    if (state.playlist.length > 0) {
      var prevIndex = state.current.index > 0 ? state.current.index - 1 : state.playlist.length - 1
      state.current = state.playlist[prevIndex]
      broadcast('queue', state.current)
      if (state.playing) { broadcast('play') }
    }
  }

  ipcMain.on('prev', prev)

  function next () {
    if (state.playlist.length > 0) {
      var nextIndex = state.current.index < state.playlist.length - 1 ? state.current.index + 1 : 0
      state.current = state.playlist[nextIndex]
      broadcast('queue', state.current)
      if (state.playing) { broadcast('play') }
    }
  }

  ipcMain.on('next', next)

  function mute (ev) {
    state.muted = true
    broadcast('mute')
  }

  ipcMain.on('mute', mute)

  function unmute (ev) {
    state.muted = false
    broadcast('unmute')
  }

  ipcMain.on('unmute', unmute)

  function timeupdate (ev, currentTime) {
    // audio -> player
    state.currentTime = currentTime
    if (player.win) player.win.send('timeupdate', currentTime)
  }

  ipcMain.on('timeupdate', timeupdate)

  function seek (ev, newTime) {
    // player -> audio
    state.currentTime = newTime
    if (player.win) audio.win.send('seek', newTime)
  }

  ipcMain.on('seek', seek)

  ipcMain.on('sync-state', function (ev) {
    ev.sender.send('sync-state', state)
  })

  globalShortcut.register('MediaNextTrack', next)
  globalShortcut.register('MediaPreviousTrack', prev)
  // globalShortcut.register('MediaStop', )
  globalShortcut.register('MediaPlayPause', playPause)
})

function allWindowsClosed () {
  if (process.platform !== 'darwin') app.quit()
}

app.on('window-all-closed', allWindowsClosed)

function activate () {
  if (player.win === null) player.init()
}

app.on('activate', activate)

function beforeQuit (e) {
  if (app.isQuitting) return

  app.isQuitting = true
  e.preventDefault()
  setTimeout(function () {
    console.error('Saving state took too long. Quitting.')
    app.quit()
  }, 5000) // quit after 5 secs, at most
  persist.set({
    playlist: state.playlist,
    current: state.current,
    volume: state.volume
  })
  app.quit()
}

app.on('before-quit', beforeQuit)
