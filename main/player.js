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
    width: 600,
    height: 400,
    minWidth: 500,
    minHeight: 200,
    titleBarStyle: 'hidden',
    useContentSize: true,
    thickFrame: true
  })

  win.loadURL(PLAYER_WINDOW)

  win.on('closed', () => {
    player.win = null
  })
}
