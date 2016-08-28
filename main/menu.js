const { app, shell, Menu } = require('electron')
const audio = require('./audio')
const pkg = require('../package.json')

module.exports = {
  init
}

function init () {
  let menu = Menu.buildFromTemplate(getTemplate())
  Menu.setApplicationMenu(menu)
}

function getTemplate () {
  var template = [
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.reload()
          }
        },
        {
          label: 'Hard Reload (Clear Cache)',
          accelerator: 'CmdOrCtrl+Shift+R',
          click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.reloadIgnoringCache()
          }
        },
        {
          label: 'Toggle Full Screen',
          accelerator: (function () {
            if (process.platform === 'darwin') return 'Ctrl+Command+F'
            return 'F11'
          })(),
          click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: (function () {
            if (process.platform === 'darwin') return 'Alt+Command+I'
            return 'Ctrl+Shift+I'
          })(),
          click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.toggleDevTools()
          }
        },
        {
          label: 'Show Audio Process',
          accelerator: process.platform === 'darwin'
            ? 'Alt+Command+P'
            : 'Ctrl+Shift+P',
          click: () => audio.toggleDevTools()
        }
      ]
    },
    {
      label: 'Window',
      role: 'window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        }
      ]
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () { shell.openExternal(pkg.homepage) }
        },
        {
          label: 'Report an Issue',
          click () { shell.openExternal(pkg.bugs.url) }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    var name = 'HyperAmp'

    template.unshift({
      label: name,
      submenu: [
        {
          label: 'About ' + name,
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: 'Services',
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide ' + name,
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Alt+H',
          role: 'hideothers'
        },
        {
          label: 'Show All',
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click () { app.quit() }
        }
      ]
    })

    template.filter(function (el) {
      return el.label === 'Window'
    })[0].submenu.push(
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        role: 'front'
      }
    )
  }

  return template
}
