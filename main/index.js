const { app, BrowserWindow, Menu } = require('electron')
const menuTemplate = require('./menu')
let win

require('electron-debug')({ showDevTools: true })
require('electron-context-menu')()

function createWindow () {
  win = new BrowserWindow({
    title: 'Hyper Amp',
    width: 840,
    height: 480,
    minWidth: 500,
    minHeight: 200,
    acceptFirstMouse: true,
    titleBarStyle: 'hidden',
    useContentSize: true
  })

  win.loadURL(`file://${__dirname}/../renderer/index.html`)
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

// Create default menu
app.once('ready', () => {
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (win === null) createWindow()
})
