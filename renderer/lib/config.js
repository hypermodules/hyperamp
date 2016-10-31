const Config = require('electron-config')
const { app } = require('electron').remote

const conf = new Config({ name: 'hyperamp.config' })

if (conf.size === 0) conf.set(defaults())

function defaults () {
  return {
    music: app.getPath('music')
  }
}

module.exports = conf
