const rpc = require('pauls-electron-rpc')
const manifest = require('../../main/config').manifest
const api = rpc.importAPI('config', manifest, { timeout: 30e3 })

var config = {
  namespace: 'config',
  state: api.store(),
  reducers: {
    update: (state, data) => data
  },
  effects: {
    set: (state, data, send, done) => {
      console.log(data)
      console.log(api.set(data))
      send('config:update', data, done)
    }
  }
}

module.exports = config
