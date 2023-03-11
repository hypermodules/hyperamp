// var electron = require('electron')
const path = require('path')
// var mkdirp = require('mkdirp')
const pump = require('pump')
const crypto = require('crypto')
const mkdirp = require('mkdirp')
const { artwork } = require('./util')
const BufferList = require('bl')

// var configPath = (electron.app || electron.remote.app).getPath('userData')
// var artworkCachePath = path.join(configPath, 'artwork-cache')
//
// mkdirp.sync(artworkCachePath)
const blobs = require('content-addressable-blob-store')

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
    const self = this
    artwork(filePath, function (err, buff) {
      if (err) return cb(err)
      if (buff === null) return cb(null, null)
      const digest = crypto.createHash(self._algo).update(buff).digest('hex')
      self._blobs.resolve(digest, function (err, blobPath) {
        if (err) return cb(err)
        if (blobPath) {
          return cb(null, blobPath)
        } else {
          const writeStream = self._blobs.createWriteStream()
          pump((new BufferList()).append(buff), writeStream, function (err) {
            if (err) return cb(err)
            return self._blobs.resolve(writeStream.key, cb)
          })
        }
      })
    })
  }
}

module.exports = ArtworkCache
