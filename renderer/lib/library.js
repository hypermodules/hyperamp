const fs = require('fs')
const path = require('path')
const walker = require('folder-walker')
const mm = require('musicmetadata')
const validExtensions = ['.m4a', '.mp3']

module.exports = (libPath, cb) => {
  walker([libPath]).on('data', function (data) {
    if (!isValidFile(data)) return
    parseMetadata(data, cb)
  })
}

function isValidFile (data) {
  if (data.type !== 'file') return false
  return validExtensions.includes(path.extname(data.basename))
}

function parseMetadata (data, cb) {
  mm(fs.createReadStream(data.filepath), function (err, metadata) {
    if (err) return cb(err)

    // append path to metadata
    metadata.path = data.filepath

    // default title is file name
    if (metadata.title === '') {
      let { basename } = data
      metadata.title = path.basename(basename, path.extname(basename))
    }

    cb(null, metadata)
  })
}
