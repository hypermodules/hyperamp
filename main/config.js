const { app } = require('electron')
const Config = require('electron-store')

const config = new Config({ name: 'hyperamp-config' })
if (config.size === 0) config.set(defaults())

function defaults () {
  return {
    paths: [app.getPath('music')]
  }
}

module.exports = config
