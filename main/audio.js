const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const AUDIO_WINDOW = 'file://' + path.resolve(__dirname, '..', 'renderer', 'audio.html')
const audio = module.exports = {
  init,
  send,
  show,
  toggleDevTools,
  win: null
}

function init () {
  let win = audio.win = new BrowserWindow({
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
