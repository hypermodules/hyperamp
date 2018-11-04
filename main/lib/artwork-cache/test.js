var test = require('tape')
var { artwork } = require('./util')
var path = require('path')
var concatStream = require('concat-stream')
var isBuffer = require('is-buffer')
var pump = require('pump')
var bufferEqual = require('buffer-equal')
var tmp = require('temporary-directory')
var ArtworkCache = require('./index.js')
var testData = require('./test-data')
var BufferList = require('bl')

test('get artwork from file', function (t) {
  artwork(testData.mp3WithArtwork, function (err, imageBuf) {
    t.error(err, 'got artwork buffer')
    t.true(isBuffer(imageBuf), 'can get arwork from mp3s')
    t.end()
  })
})

test('can stream buffers', function (t) {
  artwork(testData.mp3WithArtwork, bufferTests)

  function bufferTests (err, imageBuf) {
    t.error(err, 'got artwork buffer')
    var imageBufferStream = new BufferList()
    imageBufferStream.append(imageBuf)
    var concat = concatStream(gotPic)
    var streamedBuff

    function gotPic (buf) {
      streamedBuff = buf
    }

    function streamEnded (err) {
      t.error(err, 'stream ended without error')
      t.true(bufferEqual(imageBuf, streamedBuff), 'buffers are the same after streaming')
      t.end()
    }

    pump(imageBufferStream, concat, streamEnded)
  }
})

test('artwork cache for existing file', function (t) {
  tmp(created)

  function created (err, dir, cleanup) {
    t.error(err, 'created temp dir')
    var cache = new ArtworkCache(path.join(dir))
    cache.getPath(testData.mp3WithArtwork, handlePath)

    function handlePath (err, blobPath) {
      t.error(err, 'got path without error')
      t.equal(typeof blobPath, 'string', 'got a path back')

      cache.getPath(testData.mp3WithArtwork, handlePathAgain)
    }

    function handlePathAgain (err, blobPath) {
      t.error(err, 'got path without error')
      t.equal(typeof blobPath, 'string', 'got same path back')
      cleanup(cleanedUp)
    }
  }

  function cleanedUp (err) {
    t.error(err, 'cleaned up')
    t.end()
  }
})

test('artwork cache for missing file', function (t) {
  tmp(created)

  function created (err, dir, cleanup) {
    t.error(err, 'created temp dir')
    var cache = new ArtworkCache(path.join(dir))
    cache.getPath(path.join(__dirname, 'foo'), handlePath)

    function handlePath (err, blobPath) {
      t.equal(err.code, 'ENOENT', 'errors propgated up from the bottom')
      cache.getPath(path.join(__dirname, 'foo'), handlePathAgain)
    }

    function handlePathAgain (err, blobPath) {
      t.equal(err.code, 'ENOENT', 'errors propgated up from the bottom')
      cleanup(cleanedUp)
    }
  }

  function cleanedUp (err) {
    t.error(err, 'cleaned up')
    t.end()
  }
})

test('artwork cache for existing file without art', function (t) {
  tmp(created)

  function created (err, dir, cleanup) {
    t.error(err, 'created temp dir')
    var cache = new ArtworkCache(path.join(dir))
    cache.getPath(testData.mp3WithoutArtowork, handlePath)

    function handlePath (err, blobPath) {
      t.error(err, 'no error')
      t.equal(blobPath, null, 'blob path is null when it doesnt exist')
      cache.getPath(testData.mp3WithoutArtowork, handlePathAgain)
    }

    function handlePathAgain (err, blobPath) {
      t.error(err, 'no error')
      t.equal(blobPath, null, 'blob path is null when it doesnt exist from cache!')
      cleanup(cleanedUp)
    }
  }

  function cleanedUp (err) {
    t.error(err, 'cleaned up')
    t.end()
  }
})
