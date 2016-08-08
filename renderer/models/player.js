module.exports = {
  namespace: 'player',
  state: {
    search: ''
  },
  reducers: {
    search: (data, state) => ({ search: data })
  }
}
