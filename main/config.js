var { app } = require('electron')
var Config = require('electron-config')

var config = new Config({ name: 'hyperamp.config' })
if (config.size === 0) config.set(defaults())

function defaults () {
  return {
    music: app.getPath('music')
  }
}

module.exports = config
