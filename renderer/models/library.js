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
    search: (state, data) => ({ search: data }),
    clear: (state, data) => ({ files: [] })
  },
  effects: {
    loadSongs: (state, data, send, done) => {
      send('library:clear', (err) => {
        if (err) return done(err)
        libStream(config.get('music'), (err, metadata) => {
          if (err) return done(err)
          send('library:metadata', metadata, done)
        })
      })
    }
  },
  subscriptions: {
    'called-once-when-the-app-loads': (send, done) => {
      send('library:loadSongs', done)
    }
  }
}
