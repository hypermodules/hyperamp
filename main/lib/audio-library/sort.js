function sort ([keyA, aObj], [keyB, bObj]) {
      // sort by albumartist
      // if (aObj.albumartist[0] < bObj.albumartist[0]) return -1
      // if (aObj.albumartist[0] > bObj.albumartist[0]) return 1

      // sort by artist
  // if (aObj.artist[0] < bObj.artist[0]) return -1
  // if (aObj.artist[0] > bObj.artist[0]) return 1
//
  //    // then by album
  // if (aObj.album < bObj.album) return -1
  // if (aObj.album > bObj.album) return 1
//
  //    // then by disc no
  // if (aObj.disk.no < bObj.disk.no) return -1
  // if (aObj.disk.no > bObj.disk.no) return 1
//
  //    // then by disc no
  // if (aObj.track.no < bObj.track.no) return -1
  // if (aObj.track.no > bObj.track.no) return 1
//
  //    // then by title
  // if (aObj.title < bObj.title) return -1
  // if (aObj.title > bObj.title) return 1

      // then by filepath
  if (aObj.filepath.toLowerCase() < bObj.filepath.toLowerCase()) return -1
  if (aObj.filepath.toLowerCase() > bObj.filepath.toLowerCase()) return 1
  return 0
}

module.exports = sort
