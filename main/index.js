var { app, ipcMain } = require('electron')
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
  playing: false
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

  ipcMain.on('audio', function (/* ev, args... */) {
    // forward audio ipc events
    var args = [].slice.call(arguments, 1)
    audio.win.send.apply(audio.win, args)
  })

  ipcMain.on('playlist', function (ev, playlist) {
    state.playlist = playlist
  })

  ipcMain.on('queue', function (ev, meta) {
    state.current = meta
    broadcast('queue', meta)
  })

  ipcMain.on('play', function (ev) {
    state.playing = true
    broadcast('play')
  })

  ipcMain.on('pause', function (ev) {
    state.playing = false
    broadcast('pause')
  })

  ipcMain.on('prev', function (ev) {
    if (state.playlist.length > 0) {
      var prevIndex = state.current.index > 0 ? state.current.index - 1 : state.playlist.length - 1
      state.current = state.playlist[prevIndex]
      broadcast('queue', state.current)
      if (state.playing) { broadcast('play') }
    }
  })

  ipcMain.on('next', function (ev) {
    if (state.playlist.length > 0) {
      var nextIndex = state.current.index < state.playlist.length - 1 ? state.current.index + 1 : 0
      state.current = state.playlist[nextIndex]
      broadcast('queue', state.current)
      if (state.playing) { broadcast('play') }
    }
  })

  ipcMain.on('sync-state', function (ev) {
    ev.sender.send('sync-state', state)
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (player.win === null) player.init()
})

app.on('before-quit', function (e) {
  if (app.isQuitting) return

  app.isQuitting = true
  e.preventDefault()
  setTimeout(() => {
    console.error('Saving state took too long. Quitting.')
    app.quit()
  }, 2000) // quit after 2 secs, at most
  persist.set({
    playlist: state.playlist,
    current: state.current,
    volume: state.volume
  })
  app.quit()
})
