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
      metadata: (data, state) => ({ files: state.files.concat(data) }),
      search: (data, state) => ({ search: data })
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
