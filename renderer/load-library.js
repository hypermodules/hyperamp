const fs = require('fs')
const waterfall = require('run-waterfall')
const path = require('path')

const mediaLib = path.resolve(__dirname, '../mock-lib')

waterfall([
  getFiles,
  filterForAudio,
  log], function (err) {
  if (err) throw (err)
})

function getFiles (cb) {
  fs.readdir(mediaLib, cb)
}

function filterForAudio (files, cb) {
  var mp3Files = files.filter(checkFilename)
  cb(null, mp3Files)
}

function checkFilename (file) {
  var extensions = ['.m4a', '.mp3']
  return extensions.find(ext => file.includes(ext))
}

function log (mp3Files, cb) {
  console.log(mp3Files)
  cb()
}
