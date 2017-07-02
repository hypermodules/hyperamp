var get = require('lodash.get')
var nativeImage = require('electron').nativeImage
var metadata = require('./metadata')
var crypto = require('crypto')

var artworkCache = {}

function artwork (path, cb) {
  metadata(path, lookupArtwork)

  function lookupArtwork (err, meta) {
    if (err) return cb(err)
    var artBuff = get(meta, 'common.picture[0].data')
    if (!artBuff) return cb(null, null)
    var hash = crypto.createHash('sha256').digest('hex')
    var nativeBuff = nativeImage.createFromBuffer(artBuff)
    var thumbnail = nativeBuff.getAspectRatio() >= 1 ? nativeBuff.resize({width: 175, quality: 'good'}) : nativeBuff.resize({height: 175, quality: 'good'})
    artworkCache[hash] = thumbnail.toDataURL()
    cb(null, hash)
  }
}

module.exports = artwork
