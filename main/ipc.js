const { ipcMain } = require('electron')
const audio = require('./audio')

module.exports = {
  init
}

// TODO: manage minimal global state on main thread
// Main reason for now is so that player thread always knows audio state on init
// (current song, playing?)

function init () {
  let oldEmit = ipcMain.emit

  ipcMain.emit = function (name) {
    // pass messages from player to audio
    let args = [].concat('audio', [].slice.call(arguments, 2))
    if (name === 'audio') return audio.send.apply(audio, args)

    // Emit all other events normally
    oldEmit.apply(ipcMain, arguments)
  }
}
