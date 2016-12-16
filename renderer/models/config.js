module.exports = (config) => {
  return {
    namespace: 'config',
    state: config.store,
    reducers: {
      update: (state, data) => data
    },
    effects: {
      set: (state, data, send, done) => {
        config.set(data)
        send('config:update', data, done)
      }
    }
  }
}
