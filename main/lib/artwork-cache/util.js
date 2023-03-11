const mm = require('music-metadata')
const get = require('lodash.get')
const fs = require('fs')

function metadata (path, cb) {
  fs.stat(path, function (err, stats) {
    if (err) return cb(err)
    mm.parseFile(path, {
      native: true,
      duration: true,
      skipCovers: false
    }).then(function (md) {
      return cb(null, md)
    }).catch(function (err) {
      return cb(err)
    })
  })
}

exports.artwork = artwork

function artwork (path, cb) {
  metadata(path, lookupArtwork)

  function lookupArtwork (err, meta) {
    if (err) return cb(err)
    const artBuff = get(meta, 'common.picture[0].data')
    if (!artBuff) return cb(null, null)
    return cb(null, artBuff)
  }
}
