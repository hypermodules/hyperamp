var { app } = require('electron')
var Config = require('electron-store')

var config = new Config({ name: 'hyperamp-config' })
if (config.size === 0) config.set(defaults())

function defaults () {
  return {
    paths: [app.getPath('music')]
  }
}

module.exports = config
