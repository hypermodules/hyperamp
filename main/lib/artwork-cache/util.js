var from = require('from2')
var mm = require('music-metadata')
var get = require('lodash.get')

exports.fromBuffer = fromBuffer

function fromBuffer (buffer) {
  // TODO: Use https://github.com/rvagg/bl ?
  return from(function (size, next) {
    if (buffer.length <= 0) return next(null, null)
    var chunk = buffer.slice(0, size)
    buffer = buffer.slice(size)
    next(null, chunk)
  })
}

function metadata (path, cb) {
  mm.parseFile(path, {
    native: true,
    duration: true,
    skipCovers: false
  }).then(function (md) {
    return cb(null, md)
  }).catch(function (err) {
    return cb(err)
  })
}

exports.artwork = artwork

function artwork (path, cb) {
  metadata(path, lookupArtwork)

  function lookupArtwork (err, meta) {
    if (err) return cb(err)
    var artBuff = get(meta, 'common.picture[0].data')
    if (!artBuff) return cb(null, null)
    return cb(null, artBuff)
  }
}
