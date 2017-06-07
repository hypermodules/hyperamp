var from = require('from2')
var fs = require('fs')
var mm = require('music-metadata')
var get = require('lodash.get')

exports.fromBuffer = fromBuffer

function fromBuffer (buffer) {
  return from(function (size, next) {
    if (buffer.length <= 0) return next(null, null)
    var chunk = buffer.slice(0, size)
    buffer = buffer.slice(size)
    next(null, chunk)
  })
}

function metadata (path, cb) {
  var audioStream = fs.createReadStream(path)
  mm.parseStream(audioStream, {native: true}, function (err, metadata) {
    // important note, the stream is not closed by default. To prevent leaks, you must close it yourself
    audioStream.close()
    audioStream.destroy()
    return cb(err, err ? null : metadata)
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
