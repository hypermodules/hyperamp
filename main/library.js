var MusicLibrary = require('music-library')
var config = require('./config.js')
var path = require('path')
var rpc = require('pauls-electron-rpc')

var dbPath = path.dirname(config.path)
var musicPath = config.get('music')
var library = new MusicLibrary(dbPath, musicPath)

function init () {
  library.scan(function (err) {
    if (err) throw err
    console.log('done')
    library.clean(function (err) {
      if (err) throw err
      console.log('clean')
    })
  })
}

var manifest = {
  songStream: 'readable'
}

var api = rpc.exportAPI('library', manifest, {
  // the exported API behaves like normal calls:
  songStream: library.db.byAlbumArtistYear.createReadStream
})
// log any errors
api.on('error', console.log)

module.exports = library
module.exports.init = init
module.exports.manifest = manifest

