var fs = require('fs')
var path = require('path')
var walker = require('folder-walker')
var mm = require('musicmetadata')
var writer = require('flush-write-stream')
var filter = require('through2-filter')
var pump = require('pump')
var validExtensions = ['m4a', 'mp3', 'ogg']

module.exports = makeTrackDict

function makeTrackDict (paths, cb) {
  var newTrackDict = {}
  var dest = concatTrackDict(newTrackDict)
  pump(walker(paths), FileFilter(), dest, handleEos)
  // Return dest so we can destroy it
  return dest

  function handleEos (err) {
    if (err) return cb(err)
    cb(null, newTrackDict)
  }
}
var FileFilter = filter.objCtor(isValidFile)

function isValidFile (data, enc, cb) {
  if (data.type !== 'file') return false
  var ext = path.extname(data.basename).substring(1)
  return validExtensions.includes(ext)
}

function concatTrackDict (obj) {
  function writeTrackDict (data, enc, cb) {
    parseMetadata(data, handleMeta)

    function handleMeta (err, meta) {
      if (err) return cb(err)
      obj[meta.filepath] = meta
      cb(null)
    }
  }
  return writer.obj(writeTrackDict)
}

function parseMetadata (data, cb) {
  var { filepath } = data
  var readableStream = fs.createReadStream(filepath)
  mm(readableStream, { duration: true }, (err, meta) => {
    readableStream.close()
    if (err) {
      switch (err.message) {
        case 'Could not find metadata header':
          console.warn(err.message += ` (file: ${filepath})`)
          break
        default:
          return cb(err)
      }
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
