var libStream = require('../lib/library')

module.exports = (config) => {
  let libPath = config.get('music')

  return {
    namespace: 'library',
    state: {
      files: []
    },
    reducers: {
      metadata: (data, state) => {
        return { files: state.files.concat(data) }
      }
    },
    subscriptions: [
      (send, done) => libStream(libPath, send, done)
    ]
  }
}
