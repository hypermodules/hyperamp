module.exports = {
  namespace: 'player',
  state: {
    search: '',
    volume: 100
  },
  reducers: {
    search: (data, state) => ({ search: data }),
    volume: (data, state) => ({ volume: data })
  }
}
