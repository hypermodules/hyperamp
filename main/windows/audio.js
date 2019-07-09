var { app, BrowserWindow } = require('electron')
var path = require('path')
var log = require('electron-log')
var AUDIO_WINDOW = 'file://' + path.resolve(__dirname, '..', '..', 'renderer', 'audio', 'index.html')
var audio = module.exports = {
  init,
  show,
  toggleDevTools,
  win: null
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
    width: 200,
    contextIsolation: true,
    webPreferences: {
      nodeIntegration: true
    },
    webSecurity: true
  })

  win.loadURL(AUDIO_WINDOW)

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

function toggleDevTools () {
  if (!audio.win) return
  log.info('[AUDIO] Toggling dev tools')
  if (audio.win.webContents.isDevToolsOpened()) {
    audio.win.webContents.closeDevTools()
    audio.win.hide()
  } else {
    audio.win.webContents.openDevTools({ detach: true })
  }
}
