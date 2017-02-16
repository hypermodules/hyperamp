var { ipcRenderer } = require('electron')

module.exports = {
  namespace: 'player',
  state: {
    playing: false,
    current: null,
    volume: 100
  },
  reducers: {
    playing: (state, data) => data,
    volume: (state, data) => {
      ipcRenderer.send('audio', 'volume', data)
      return data
    }
  },
  effects: {
    play: (state, data, send, done) => {
      ipcRenderer.send('audio', 'play', data)
      send('player:playing', { playing: true, current: data }, done)
    },
    pause: (state, data, send, done) => {
      ipcRenderer.send('audio', 'pause')
      send('player:playing', { playing: false }, done)
    },
    prev: (state, data, send, done) => {
      console.log('not yet implemented')
      done()
    },
    next: (state, data, send, done) => {
      console.log('not yet implemented')
      done()
    }
  }
}
