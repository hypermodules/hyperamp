const { BrowserWindow } = require('electron')
const path = require('path')
const PLAYER_WINDOW = 'file://' + path.resolve(__dirname, '..', 'renderer', 'index.html')
const player = module.exports = {
  init,
  win: null
}

require('electron-debug')({ showDevTools: true })
require('electron-context-menu')()

function init () {
  let win = player.win = new BrowserWindow({
    title: 'Hyper Amp',
    width: 800,
    height: 600,
    minWidth: 640,
    minHeight: 400,
    titleBarStyle: 'hidden-inset',
    useContentSize: true,
    show: false,
    thickFrame: true
  })

  win.loadURL(PLAYER_WINDOW)

  win.once('ready-to-show', win.show)

  win.on('closed', () => {
    player.win = null
  })
}
