var libStream = require('../lib/library')

module.exports = (config) => {
  let libPath = config.get('music')

  return {
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
        libStream(libPath, (err, metadata) => {
          if (err) return done(err)
          send('library:metadata', metadata, done)
        })
      }
    }
  }
}
