const fs = require('fs')
const path = require('path')
const walker = require('folder-walker')
const mm = require('musicmetadata')
const validExtensions = ['m4a', 'mp3']

module.exports = (libPath, cb) => {
  walker([libPath]).on('data', data => {
    if (!isValidFile(data)) return
    parseMetadata(data, cb)
  })
}

function isValidFile (data) {
  if (data.type !== 'file') return false
  let ext = path.extname(data.basename).substring(1)
  return validExtensions.includes(ext)
}

function parseMetadata (data, cb) {
  let { filepath } = data

  mm(fs.createReadStream(filepath), { duration: true }, (err, meta) => {
    if (err) {
      err.message += ` (file: ${filepath})`
      return cb(err)
    }

    let { title, artist, album, duration } = meta

    if (!title) {
      let { basename } = data
      let ext = path.extname(basename)
      title = path.basename(basename, ext)
    }

    cb(null, { title, artist, album, duration, filepath })
  })
}
