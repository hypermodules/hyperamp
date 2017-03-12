var fs = require('fs')
var mm = require('music-metadata')

function metadata (path, cb) {
  var audioStream = fs.createReadStream(path)
  mm.parseStream(audioStream, {native: true}, function (err, metadata) {
  // important note, the stream is not closed by default. To prevent leaks, you must close it yourself
    audioStream.close()
    if (err) return cb(err)

    return cb(err, metadata)
  })
}

module.exports = metadata
