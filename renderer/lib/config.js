const Config = require('electron-config')
const { app } = require('electron').remote

module.exports = () => {
  const conf = new Config()

  if (conf.size === 0) conf.set(defaults())

  return conf
}

function defaults () {
  return {
    music: app.getPath('music')
  }
}
