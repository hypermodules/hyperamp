var electron = require('electron')
var config = electron.remote.require('./config.js')
var ipcRenderer = electron.ipcRenderer

var configModel = {
  namespace: 'config',
  state: config.store,
  reducers: {
    update: (state, data) => data
  },
  effects: {
    set: (state, data, send, done) => {
      config.set(data) // Update the config
      ipcRenderer.send('config', data) // Notify main process
      send('config:update', data, done) // update UI state
    }
  }
}

module.exports = configModel
