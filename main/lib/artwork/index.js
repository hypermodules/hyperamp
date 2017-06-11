var level = require('level')
var electron = require('electron')
var path = require('path')
var mkdirp = require('mkdirp')
var pump = require('pump')
var crypto = require('crypto')
var { artwork, fromBuffer } = require('./util')

// var configPath = (electron.app || electron.remote.app).getPath('userData')
// var artworkCachePath = path.join(configPath, 'artwork-cache')
//
// mkdirp.sync(artworkCachePath)
var blobs = require('content-addressable-blob-store')

class ArtworkCache {
  constructor (dir) {
    this._directory = dir
    this._algo = 'sha256'
    this._db = level(path.join(this._directory, 'artwork-cache'))
    this._blobs = blobs({
      path: path.join(this._directory, 'blobs'),
      algo: 'sha256'
    })
  }

  extractArt (filePath, cb) {
    var self = this
    artwork(filePath, function (err, buff) {
      if (err) return cb(err)
      if (buff === null) return self._db.put(filePath, false, cb)
      var digest = crypto.createHash(self._algo).update(buff).digest('hex')
      self._blobs.resolve(digest, function (err, blobPath) {
        if (err) return cb(err)
        if (blobPath) {
          self._db.put(filePath, digest, function (err) {
            return cb(err, err ? null : blobPath)
          })
        } else {
          var writeStream = self._blobs.createWriteStream()
          pump(fromBuffer(buff), writeStream, function (err) {
            if (err) return cb(err)
            self._db.put(filePath, writeStream.key, function (err) {
              if (err) return cb(err)
              return self.getPath(filePath, cb)
            })
          })
        }
      })
    })
  }

  getPath (filePath, cb) {
    var self = this
    this._db.get(filePath, function (err, key) {
      if (err) {
        if (err.notFound) return self.extractArt(filePath, cb)
        return cb(err)
      }
      // image was determined to be missing
      if (key === false) return cb(null, null)
      // we have a key, lets get the file path
      self._blobs.resolve(key, function (err, blobPath) {
        if (err) return cb(err)
        if (blobPath) return cb(null, blobPath)
        // We have a key, but the blob is missing. regenerate
        return self.extractArt(filePath, cb)
      })
    })
  }
}

module.exports = ArtworkCache
