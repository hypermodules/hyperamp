const { app } = require('electron')
const Config = require('electron-config')

const config = new Config({ name: 'hyperamp.config' })
if (config.size === 0) config.set(defaults())

function defaults () {
  return {
    music: app.getPath('music')
  }
}

console.log(config.store)
module.exports = config
