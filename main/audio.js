var { app, BrowserWindow, ipcMain } = require('electron')
var path = require('path')
var player = require('./player')
var AUDIO_WINDOW = 'file://' + path.resolve(__dirname, '..', 'renderer', 'audio.html')
var audio = module.exports = {
  init,
  send,
  show,
  toggleDevTools,
  win: null,
  playlist: [],
  current: {},
  playing: false
}

function init () {
  var win = audio.win = new BrowserWindow({
    title: 'hyperamp-hidden-window',
    backgroundColor: '#1E1E1E',
    center: true,
    fullscreen: false,
    fullscreenable: false,
    height: 100,
    maximizable: false,
    minimizable: false,
    resizable: false,
    show: false,
    skipTaskbar: true,
    useContentSize: true,
    width: 200
  })

  win.loadURL(AUDIO_WINDOW)

  ipcMain.on('audio', function (/* ev, args... */) {
    // forward audio ipc events
    var args = [].slice.call(arguments, 1)
    win.send.apply(win, args)
  })

  ipcMain.on('playlist', function (ev, playlist) {
    audio.playlist = playlist
  })

  ipcMain.on('play', function (ev, meta) {
    if (meta) audio.current = meta
    audio.playing = true
    win.send('play', meta)
    player.win.send('play', audio.current)
  })

  ipcMain.on('pause', function (ev) {
    audio.playing = false
    win.send('pause')
    player.win.send('pause', audio.current)
  })

  ipcMain.on('prev', function (ev) {
    if (audio.current.length > 0) {
      var prevIndex = audio.current.index > 0 ? audio.current.index - 1 : audio.playlist.length - 1
      audio.current = audio.playlist[prevIndex]
      win.send('play', audio.current)
      player.win.send('play', audio.current)
    }
  })

  ipcMain.on('next', function (ev) {
    if (audio.current.length > 0) {
      var nextIndex = audio.current.index < audio.playlist.length - 1 ? audio.current.index + 1 : 0
      audio.current = audio.playlist[nextIndex]
      win.send('play', audio.current)
      player.win.send('play', audio.current)
    }
  })

  // prevent killing the audio process
  win.on('close', function (e) {
    if (app.isQuitting) return
    e.preventDefault()
    win.hide()
  })
}

function show () {
  if (!audio.win) return
  audio.win.show()
}

function send () {
  if (!audio.win) {
    return console.error('[AUDIO] Tried to send before audio process was ready', arguments)
  }

  audio.win.send.apply(audio.win, arguments)
}

function toggleDevTools () {
  if (!audio.win) return
  console.log('[AUDIO] Toggling dev tools')
  if (audio.win.webContents.isDevToolsOpened()) {
    audio.win.webContents.closeDevTools()
    audio.win.hide()
  } else {
    audio.win.webContents.openDevTools({ detach: true })
  }
}
