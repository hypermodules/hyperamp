const { BrowserWindow, app } = require('electron')
const windowStateKeeper = require('electron-window-state')
const path = require('path')
const log = require('electron-log')
const remoteMain = require('@electron/remote/main')
const PLAYER_WINDOW = 'file://' + path.resolve(__dirname, '..', '..', 'renderer', 'player', 'index.html')

const player = module.exports = {
  init,
  toggleAlwaysOnTop,
  win: null,
  windowState: null
}

let alwaysOnTop = false

import('electron-debug').then(({ default: debug }) => {
  debug({ showDevTools: 'undocked' })
}).catch(err => {
  console.error('Failed to load electron-debug:', err)
})

import('electron-context-menu').then(({ default: contextMenu }) => {
  contextMenu({
    showSaveImageAs: true
  })
}).catch(err => {
  console.error('Failed to load electron-context-menu:', err)
})

function init () {
  player.windowState = windowStateKeeper({ width: 800, height: 600 })
  const win = player.win = new BrowserWindow({
    title: 'Hyper Amp',
    x: player.windowState.x,
    y: player.windowState.y,
    width: player.windowState.width,
    height: player.windowState.height,
    minWidth: 580,
    minHeight: 76,
    titleBarStyle: 'hiddenInset',
    useContentSize: true,
    show: false,
    backgroundColor: '#fff',
    thickFrame: true,
    alwaysOnTop,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      webSecurity: true,
      contextIsolation: false
    }
  })

  remoteMain.enable(win.webContents)

  player.windowState.manage(win)

  win.loadURL(PLAYER_WINDOW)

  win.once('ready-to-show', win.show)

  win.on('closed', () => {
    player.win = null
  })

  if (process.platform !== 'darwin') { // TODO System tray on windows (maybe linux)
    // since window-all-closed doesn't fire with our hidden audio process
    player.win.once('closed', () => {
      app.quit()
    })
  }
}

function toggleAlwaysOnTop () {
  if (!player.win) return
  log.info('[PLAYER] Toggling Always on Top')
  if (player.win.isAlwaysOnTop()) {
    alwaysOnTop = false
    player.win.setAlwaysOnTop(alwaysOnTop)
  } else {
    alwaysOnTop = true
    player.win.setAlwaysOnTop(alwaysOnTop)
  }
}
