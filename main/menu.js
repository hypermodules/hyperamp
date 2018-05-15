var { app, shell, Menu } = require('electron')
var defaultMenu = require('electron-default-menu')
var audio = require('./windows/audio')
var pkg = require('../package.json')

module.exports = {
  init
}

function getSubmenu (menus, label) {
  return menus.reduce(function (accum, menu) {
    if (menu.label === label) return menu
    else return accum
  }, null).submenu
}

var menuTemplate = defaultMenu(app, shell)
var viewMenu = getSubmenu(menuTemplate, 'View')
var helpMenu = getSubmenu(menuTemplate, 'Help')

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

helpMenu[0] = {
  label: 'Learn More',
  click () { shell.openExternal(pkg.homepage) }
}

helpMenu[1] = {
  label: 'Report an Issue',
  click () { shell.openExternal(pkg.bugs.url) }
}

function init () {
  var menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
}
