module.exports = {
  state: {
    title: 'HyperAmp',
    search: ''
  },
  reducers: {
    update: (data, state) => ({ search: data })
  }
}
