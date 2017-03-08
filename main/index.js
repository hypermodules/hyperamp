var { app, ipcMain } = require('electron')
var audio = require('./audio')
var menu = require('./menu')
var player = require('./player')
require('./config')

var state = {
  win: null,
  playlist: [],
  current: {},
  playing: false
}

app.on('ready', () => {
  menu.init()
  audio.init()
  player.init()

  ipcMain.on('audio', function (/* ev, args... */) {
    // forward audio ipc events
    var args = [].slice.call(arguments, 1)
    audio.win.send.apply(audio.win, args)
  })

  ipcMain.on('playlist', function (ev, playlist) {
    state.playlist = playlist
  })

  ipcMain.on('play', function (ev, meta) {
    if (meta) audio.current = meta
    state.playing = true
    audio.win.send('play', meta)
    player.win.send('play', audio.current)
  })

  ipcMain.on('pause', function (ev) {
    state.playing = false
    audio.win.send('pause')
    player.win.send('pause', audio.current)
  })

  ipcMain.on('prev', function (ev) {
    if (state.playlist.length > 0) {
      var prevIndex = state.current.index > 0 ? state.current.index - 1 : state.playlist.length - 1
      state.current = state.playlist[prevIndex]
      audio.win.send('play', state.current)
      player.win.send('play', state.current)
    }
  })

  ipcMain.on('next', function (ev) {
    if (state.playlist.length > 0) {
      var nextIndex = state.current.index < state.playlist.length - 1 ? state.current.index + 1 : 0
      state.current = state.playlist[nextIndex]
      audio.win.send('play', state.current)
      player.win.send('play', state.current)
    }
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
  // windows.main.dispatch('saveState') // try to save state on exit
  // ipcMain.once('savedState', () => app.quit())
  setTimeout(() => {
    // console.error('Saving state took too long. Quitting.')
    app.quit()
  }, 0) // quit after 2 secs, at most
})
