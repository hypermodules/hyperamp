var libStream = require('../lib/library')
var config = require('electron').remote.require('./config.js')

module.exports = {
  namespace: 'library',
  state: {
    files: [],
    search: ''
  },
  reducers: {
    metadata: (state, data) => ({ files: state.files.concat(data) }),
    sort: (state, date) => ({ files: sortList(state.files) }),
    search: (state, data) => ({ search: data }),
    clear: (state, data) => ({ files: [] })
  },
  effects: {
    loadSongs: (state, data, send, done) => {
      send('library:clear', (err) => {
        if (err) return done(err)
        libStream(config.get('music'), (err, metadata) => {
          if (err) return done(err)
          send('library:metadata', metadata, err => {
            if (err) return done(err)
            send('library:sort', done)
          })
        })
      })
    }
  },
  subscriptions: {
    'called-once-when-the-app-loads': (send, done) => {
      // send('library:loadSongs', done)
    }
  }
}

// TODO: expose sort to state to allow sort using column headers
function sortList (files) {
  return files.sort((a, b) => {
    // sort by artist
    if (a.artist < b.artist) return -1
    if (a.artist > b.artist) return 1

    // then by album
    if (a.album < b.album) return -1
    if (a.album > b.album) return 1

    // then by title
    if (a.title < b.title) return -1
    if (a.title > b.title) return 1
    return 0
  })
}
