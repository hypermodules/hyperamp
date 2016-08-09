module.exports = {
  namespace: 'player',
  state: {
    volume: 100
  },
  reducers: {
    volume: (data, state) => ({ volume: data })
  }
}
