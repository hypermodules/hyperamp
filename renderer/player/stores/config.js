const remote = require('@electron/remote')
const { ipcRenderer } = require('electron')

const config = remote.require('./config.js')
const mutate = require('xtend/mutable')

function configStore (state, emitter) {
  let localState = state.config

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
