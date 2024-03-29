const existy = require('existy')

function sort ([keyA, aObj], [keyB, bObj]) {
  // sort by albumartist
  // if (aObj.albumartist[0] < bObj.albumartist[0]) return -1
  // if (aObj.albumartist[0] > bObj.albumartist[0]) return 1

  // send tracks with no artist to bottom
  if (isEmpty(aObj.artist) && !isEmpty(bObj.artist)) return 1
  if (!isEmpty(aObj.artist) && isEmpty(bObj.artist)) return -1

  // sort by artist
  if (aObj.artist < bObj.artist) return -1
  if (aObj.artist > bObj.artist) return 1

  // then by album
  if (aObj.album < bObj.album) return -1
  if (aObj.album > bObj.album) return 1

  // then by disc no
  const aHasDisk = existy(aObj.disk)
  const bHasDisk = existy(bObj.disk)

  if (aHasDisk && bHasDisk) {
    if (aObj.disk.no < bObj.disk.no) return -1
    if (aObj.disk.no > bObj.disk.no) return 1
  }

  // then by track no
  const aHasTrack = existy(aObj.track)
  const bHasTrack = existy(bObj.track)

  if (aHasTrack && bHasTrack) {
    if (aObj.track.no < bObj.track.no) return -1
    if (aObj.track.no > bObj.track.no) return 1
  }

  // then by title
  if (aObj.title < bObj.title) return -1
  if (aObj.title > bObj.title) return 1

  // then by filepath
  if (aObj.filepath < bObj.filepath) return -1
  if (aObj.filepath > bObj.filepath) return 1

  return 0
}

function isEmpty (val) {
  return !existy(val) || val === ''
}

module.exports = sort
