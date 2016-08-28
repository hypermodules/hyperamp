const { app, BrowserWindow } = require('electron')
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
  console.log('audio:toggleDevTools')
  if (audio.win.webContents.isDevToolsOpened()) {
    audio.win.webContents.closeDevTools()
    audio.win.hide()
  } else {
    audio.win.webContents.openDevTools({ detach: true })
  }
}
