const fs = require('fs')
const path = require('path')
const walker = require('folder-walker')
const mm = require('musicmetadata')

const extensions = ['.m4a', '.mp3']

module.exports = (libPath, send, done) => {
  walker([libPath]).on('data', function (data) {
    if (!isValidFile(data)) return

    mm(fs.createReadStream(data.filepath), function (err, metadata) {
      if (err) done(err)

      // append path to metadata
      metadata.path = data.filepath

      // default title is file name
      if (metadata.title === '') {
        let { basename } = data
        metadata.title = path.basename(basename, path.extname(basename))
      }

      send('library:metadata', metadata, done)
    })
  })
}

function isValidFile (data) {
  if (data.type !== 'file') return false
  return extensions.includes(path.extname(data.basename))
}
