const Config = require('electron-config')
const {app} = require('electron').remote

function init () {
  const config = new Config()

  config.clear()

  if (config.size === 0) {
    config.set({
      music: app.getPath('music')
    })
  }

  return config
}

const config = init()

module.exports = {
  namespace: 'config',
  state: config.store,
  reducers: {
    update: (data, state) => data
  },
  effects: {
    set: (data, state, send, done) => {
      config.set(data)
      send('update', data, done)
    }
  }
}
