const libStream = require('../lib/library')
var config = require('electron').remote.require('./config.js')
var rpc = require('pauls-electron-rpc')
var manifest = {songStream: 'readable'}
var api = rpc.importAPI('library', manifest, { timeout: 30e3 })
var writer = require('flush-write-stream')
var pump = require('pump')

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
        pump(api.songStream(), writer.obj(write), (err) => done(err))
      })

      function write (data, enc, cb) {
        send('library:metadata', data, cb)
      }
    }
  },
  subscriptions: {
    'called-once-when-the-app-loads': function (send, done) {
      send('library:loadSongs', done)
    }
  }
}
