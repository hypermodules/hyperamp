// var electron = require('electron')
var path = require('path')
// var mkdirp = require('mkdirp')
var pump = require('pump')
var crypto = require('crypto')
var mkdirp = require('mkdirp')
var { artwork, fromBuffer } = require('./util')

// var configPath = (electron.app || electron.remote.app).getPath('userData')
// var artworkCachePath = path.join(configPath, 'artwork-cache')
//
// mkdirp.sync(artworkCachePath)
var blobs = require('content-addressable-blob-store')

class ArtworkCache {
  // TODO refeactor callback hexell
  constructor (dir) {
    this._directory = dir || path.join(process.cwd(), 'artwork-cache')
    mkdirp.sync(this._directory)
    this._algo = 'sha256'
    // this._db = level(path.join(this._directory, 'cache-db'))
    this._blobs = blobs({
      path: path.join(this._directory, 'blobs'),
      algo: 'sha256'
    })
  }

  getPath (filePath, cb) {
    var self = this
    artwork(filePath, function (err, buff) {
      if (err) return cb(err)
      if (buff === null) return cb(null, null)
      var digest = crypto.createHash(self._algo).update(buff).digest('hex')
      self._blobs.resolve(digest, function (err, blobPath) {
        if (err) return cb(err)
        if (blobPath) {
          return cb(null, blobPath)
        } else {
          var writeStream = self._blobs.createWriteStream()
          pump(fromBuffer(buff), writeStream, function (err) {
            if (err) return cb(err)
            return self._blobs.resolve(writeStream.key, cb)
          })
        }
      })
    })
  }
}

module.exports = ArtworkCache
