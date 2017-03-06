var { BrowserWindow } = require('electron')
var windowStateKeeper = require('electron-window-state')
var path = require('path')
var PLAYER_WINDOW = 'file://' + path.resolve(__dirname, '..', 'renderer', 'index.html')
var player = module.exports = {
  init,
  win: null,
  windowState: null
}

require('electron-debug')({ showDevTools: true })
require('electron-context-menu')()

function init () {
  player.windowState = windowStateKeeper({
    width: 800,
    height: 600
  })
  var win = player.win = new BrowserWindow({
    title: 'Hyper Amp',
    x: player.windowState.x,
    y: player.windowState.y,
    width: player.windowState.width,
    height: player.windowState.height,
    minWidth: 275,
    minHeight: 40,
    titleBarStyle: 'hidden-inset',
    useContentSize: true,
    show: false,
    thickFrame: true
  })

  player.windowState.manage(win)

  win.loadURL(PLAYER_WINDOW)

  win.once('ready-to-show', win.show)

  win.on('closed', () => {
    player.win = null
  })
}
