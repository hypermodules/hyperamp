const { app, BrowserWindow } = require('electron')
const path = require('path')
const log = require('electron-log')
const remoteMain = require('@electron/remote/main')
const AUDIO_WINDOW = 'file://' + path.resolve(__dirname, '..', '..', 'renderer', 'audio', 'index.html')
const audio = module.exports = {
  init,
  show,
  toggleDevTools,
  win: null
}

function init () {
  const win = audio.win = new BrowserWindow({
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
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      webSecurity: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  remoteMain.enable(win.webContents)

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
