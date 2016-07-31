const fs = require('fs')
const waterfall = require('run-waterfall')
const parallelLimit = require('run-parallel-limit')
const path = require('path')
const pump = require('pump')

const mediaLib = path.resolve(__dirname, '../mock-lib')

waterfall([
  getFiles,
  filterForMp3s,
  log], function (err) {
  if (err) throw (err)
})

function getFiles (cb) {
  fs.readdir(mediaLib, cb)
}

function filterForMp3s (files, cb) {
  var mp3Files = files.filter(checkFilename)
  cb(null, mp3Files)
}

function checkFilename (file) {
  return file.includes('.m4a')
}

function log (mp3Files, cb) {
  console.log(mp3Files)
  cb()
}
