const libStream = require('../lib/library')
const rpc = require('pauls-electron-rpc')
const manifest = require('../../main/config').manifest
const api = rpc.importAPI('config', manifest, { timeout: 30e3 })

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
      libStream(api.get('music'), (err, metadata) => {
        if (err) return done(err)
        send('library:metadata', metadata, done)
      })
    }
  }
}
