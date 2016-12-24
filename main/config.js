const { app } = require('electron')
const Config = require('electron-config')
const rpc = require('pauls-electron-rpc')

const config = new Config({ name: 'hyperamp.config' })
if (config.size === 0) config.set(defaults())

function defaults () {
  return {
    music: app.getPath('music')
  }
}

const manifest = {
  // simple method-types
  set: 'sync',
  get: 'sync',
  has: 'sync',
  delete: 'sync',
  clear: 'sync',
  size: 'sync',
  store: 'sync',
  path: 'sync'
}

module.exports = {
  config: config,
  init: init,
  manifest: manifest
}

function init () {
  const api = rpc.exportAPI('config', manifest, {
    set: (key, value) => config.set(key, value),
    get: (key) => config.get(key),
    has: (key) => config.has(key),
    delete: (key) => config.delete(key),
    clear: () => config.clear(),
    size: () => config.size,
    store: () => config.store,
    path: () => config.path
  })

  api.on('error', console.log)

  module.exports.api = api
}
