var test = require('tape')
var {artwork, fromBuffer} = require('./util')
var path = require('path')

test('utility functions', function (t) {
  var needlePath = path.resolve('../../rednderer/audio/needle.mp3')
  artwork(needlePath, function (err, buffer) {
    t.error(err)
    t.end()
  })
})
