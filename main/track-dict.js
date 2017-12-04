var path = require('path')
var walker = require('folder-walker')
var mm = require('music-metadata')
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
    console.log('')
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
    console.log(`Scanning ${data.filepath}`)
    parseMetadata(data, handleMeta)

    function handleMeta (err, meta) {
      if (err) throw err
      obj[meta.filepath] = meta
      cb(null)
    }
  }
  return writer.obj(writeTrackDict)
}

function parseMetadata (data, cb) {
  var { filepath } = data
  mm.parseFile(filepath, {
    duration: false,
    native: false,
    skipCovers: true
  }).then(meta => {
    var {
      albumartist,
      title,
      artist,
      album,
      year,
      track,
      disk,
      genre
    } = meta.common

    var { duration } = meta.format
    if (!title) {
      var { basename } = data
      var ext = path.extname(basename)
      title = path.basename(basename, ext)
    }

    return Promise.resolve({
      albumartist,
      title,
      artist,
      album,
      duration,
      filepath,
      year,
      track,
      disk,
      genre
    })
  }).catch(err => {
    // Ignore errors
    console.log(err.message += ` (file: ${filepath})`)
    var { basename } = data
    var ext = path.extname(basename)
    var title = path.basename(basename, ext)
    return Promise.resolve({ title, filepath })
  }).then(meta => {
    cb(null, meta)
  })
}
