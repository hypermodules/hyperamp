var fs = require('fs')
var path = require('path')
var walker = require('folder-walker')
var mm = require('musicmetadata')
var validExtensions = ['m4a', 'mp3', 'ogg']

module.exports = (libPath, cb) => {
  walker([libPath]).on('data', data => {
    if (!isValidFile(data)) return
    parseMetadata(data, cb)
  })
}

function isValidFile (data) {
  if (data.type !== 'file') return false
  var ext = path.extname(data.basename).substring(1)
  return validExtensions.includes(ext)
}

function parseMetadata (data, cb) {
  var { filepath } = data

  mm(fs.createReadStream(filepath), { duration: true }, (err, meta) => {
    if (err) {
      err.message += ` (file: ${filepath})`
      return cb(err)
    }

    var { title, artist, album, duration } = meta

    if (!title) {
      var { basename } = data
      var ext = path.extname(basename)
      title = path.basename(basename, ext)
    }

    cb(null, { title, artist, album, duration, filepath })
  })
}
