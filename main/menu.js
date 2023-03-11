const { app, shell, Menu } = require('electron')
const defaultMenu = require('electron-default-menu')
const audio = require('./windows/audio')
const player = require('./windows/player')
const pkg = require('../package.json')

module.exports = {
  init
}

function getSubmenu (menus, label) {
  return menus.reduce(function (accum, menu) {
    if (menu.label === label) return menu
    else return accum
  }, null).submenu
}

const menuTemplate = defaultMenu(app, shell)
const viewMenu = getSubmenu(menuTemplate, 'View')
const helpMenu = getSubmenu(menuTemplate, 'Help')

viewMenu.splice(1, 0, {
  label: 'Hard Reload (Clear Cache)',
  accelerator: 'CmdOrCtrl+Shift+R',
  click (item, focusedWindow) {
    if (focusedWindow) focusedWindow.webContents.reloadIgnoringCache()
  }
})

viewMenu.push({
  label: 'Show Audio Process',
  accelerator: process.platform === 'darwin'
    ? 'Alt+Command+P'
    : 'Ctrl+Shift+P',
  click: () => audio.toggleDevTools()
})

viewMenu.push({
  label: 'Always On Top',
  type: 'checkbox',
  click: () => player.toggleAlwaysOnTop()
})

helpMenu[0] = {
  label: 'Learn More',
  click () { shell.openExternal(pkg.homepage) }
}

helpMenu[1] = {
  label: 'Report an Issue',
  click () { shell.openExternal(pkg.bugs.url) }
}

function init () {
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
}
