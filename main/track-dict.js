const path = require('path')
const walker = require('folder-walker')
const mm = require('music-metadata')
const writer = require('flush-write-stream')
const filter = require('through2-filter')
const pump = require('pump')
const log = require('electron-log')
const validExtensions = ['m4a', 'mp3', 'ogg']

module.exports = makeTrackDict

const FileFilter = filter.objCtor(isValidFile)

function makeTrackDict (paths, cb) {
  const newTrackDict = {}
  const dest = concatTrackDict(newTrackDict)
  pump(walker(paths), FileFilter(), dest, handleEos)
  // Return dest so we can destroy it
  return dest

  function handleEos (err) {
    if (err) return cb(err)
    console.log('')
    cb(null, newTrackDict)
  }
}
function isValidFile (data, enc, cb) {
  if (data.type !== 'file') return false
  const ext = path.extname(data.basename).substring(1)
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
  const { filepath } = data
  mm.parseFile(filepath, {
    duration: false,
    native: false,
    skipCovers: true
  }).then(meta => {
    let {
      albumartist,
      title,
      artist,
      album,
      year,
      track,
      disk,
      genre
    } = meta.common

    const { duration } = meta.format
    if (!title) {
      const { basename } = data
      const ext = path.extname(basename)
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
    const { basename } = data
    const ext = path.extname(basename)
    const title = path.basename(basename, ext)
    return Promise.resolve({ title, filepath })
  }).then(meta => {
    cb(null, meta)
  })
}
