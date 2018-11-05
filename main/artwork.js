var path = require('path')
var { app } = require('electron')
var ArtworkCache = require('./lib/artwork-cache')
var artwork = module.exports = {
  cache: null,
  init
}

function init () {
  var configPath = app.getPath('userData')
  artwork.cache = new ArtworkCache(path.join(configPath, 'artwork-cache'))
}
