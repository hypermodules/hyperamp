var { ipcRenderer, remote } = require('electron')
var config = remote.require('./config.js')
var mutate = require('xtend/mutable')

function configStore (state, emitter) {
  var localState = state.config

  if (!localState) {
    localState = state.config = {}
    localState = config.store // wtf
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
