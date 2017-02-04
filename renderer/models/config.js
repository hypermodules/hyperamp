var config = require('electron').remote.require('./config.js')

var configModel = {
  namespace: 'config',
  state: config.store,
  reducers: {
    update: (state, data) => data
  },
  effects: {
    set: (state, data, send, done) => {
      console.log(data)
      console.log(config.set(data))
      send('config:update', data, done)
    }
  }
}

module.exports = configModel
