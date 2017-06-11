var test = require('tape')
var {artwork, fromBuffer} = require('./util')
var path = require('path')
var concatStream = require('concat-stream')
var isBuffer = require('is-buffer')
var pump = require('pump')
var bufferEqual = require('buffer-equal')
var tmp = require('temporary-directory')
var ArtworkCache = require('./index.js')
var needlePath = path.resolve(__dirname, '../../../renderer/audio/needle.mp3')

test('get artork from file', function (t) {
  artwork(needlePath, function (err, imageBuf) {
    t.error(err)
    t.true(isBuffer(imageBuf), 'can get arwork from mp3s')
    t.end()
  })
})

test('can stream buffers', function (t) {
  artwork(needlePath, bufferTests)

  function bufferTests (err, imageBuf) {
    t.error(err)
    var imageBufferStream = fromBuffer(imageBuf)
    var concat = concatStream(gotPic)
    var streamedBuff

    function gotPic (buf) {
      streamedBuff = buf
    }

    function streamEnded (err) {
      t.error(err)
      t.true(bufferEqual(imageBuf, streamedBuff), 'buffers are the same after streaming')
      t.end()
    }

    pump(imageBufferStream, concat, streamEnded)
  }
})

test('artwork cache', function (t) {
  tmp(created)

  function created (err, dir, cleanup) {
    t.error(err)
    var cache = new ArtworkCache(path.join(dir))
    cache.getPath(needlePath, handlePath)

    function handlePath (err, blobPath) {
      t.error(err)
      if (err) return cleanup(cleanedUp)
      console.log(blobPath)
      cleanup(cleanedUp)
    }
  }

  function cleanedUp (err) {
    t.error(err)
    t.end()
  }
})
