const path = require('path')
const { app } = require('electron')
const ArtworkCache = require('./lib/artwork-cache')
const artwork = module.exports = {
  cache: null,
  init
}

function init () {
  const configPath = app.getPath('userData')
  artwork.cache = new ArtworkCache(path.join(configPath, 'artwork-cache'))
}
