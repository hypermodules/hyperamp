var { app } = require('electron')
var audio = require('./audio')
var menu = require('./menu')
var player = require('./player')
require('./config')

app.on('ready', () => {
  menu.init()
  audio.init()
  player.init()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (player.win === null) player.init()
})

app.on('before-quit', function (e) {
  if (app.isQuitting) return

  app.isQuitting = true
  e.preventDefault()
  // windows.main.dispatch('saveState') // try to save state on exit
  // ipcMain.once('savedState', () => app.quit())
  setTimeout(() => {
    // console.error('Saving state took too long. Quitting.')
    app.quit()
  }, 0) // quit after 2 secs, at most
})
