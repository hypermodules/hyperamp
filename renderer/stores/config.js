var electron = require('electron')
var config = electron.remote.require('./config.js')
var ipcRenderer = electron.ipcRenderer
var mutate = require('xtend/mutable')

console.log('config', config)

function configStore (state, emitter) {
  var localState = state.config

  if (!localState) {
    localState = state.config = {}
    localState = config.store
  }

  emitter.on('config:set', set)

  function set (data) {
    mutate(localState, data)
    ipcRenderer.send('config', data)
    config.set(data)
    emitter.emit('render')
  }
}

module.exports = configStore
