const libStream = require('../lib/library')
var config = require('electron').remote.require('./config.js')

module.exports = {
  namespace: 'library',
  state: {
    files: [],
    search: ''
  },
  reducers: {
    metadata: (state, data) => ({ files: state.files.concat(data) }),
    search: (state, data) => ({ search: data })
  },
  subscriptions: {
    files: (send, done) => {
      libStream(config.get('music'), (err, metadata) => {
        if (err) return done(err)
        send('library:metadata', metadata, done)
      })
    }
  }
}
