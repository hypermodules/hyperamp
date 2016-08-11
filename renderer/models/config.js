module.exports = (config) => {
  return {
    namespace: 'config',
    state: config.store,
    reducers: {
      update: (data, state) => data
    },
    effects: {
      set: (data, state, send, done) => {
        config.set(data)
        send('config:update', data, done)
      }
    }
  }
}
