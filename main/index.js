const { app } = require('electron')
const audio = require('./audio')
const ipc = require('./ipc')
const menu = require('./menu')
const player = require('./player')

app.on('ready', () => {
  ipc.init()
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
