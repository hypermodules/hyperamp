const { ipcRenderer } = require('electron')

module.exports = {
  namespace: 'player',
  state: {
    playing: false,
    current: null,
    volume: 100
  },
  reducers: {
    playing: (data, state) => data,
    volume: (data, state) => {
      ipcRenderer.send('audio', 'volume', data)
      return data
    }
  },
  effects: {
    play: (data, state, send, done) => {
      ipcRenderer.send('audio', 'play', data)
      send('player:playing', { playing: true, current: data }, done)
    },
    pause: (data, state, send, done) => {
      ipcRenderer.send('audio', 'pause')
      send('player:playing', { playing: false }, done)
    },
    prev: (data, state, send, done) => {
      console.log('not yet implemented')
      done()
    },
    next: (data, state, send, done) => {
      ipcRenderer.send('audio', 'next')
      console.log('not yet implemented')
      // TODO: just realized it makes a lot of sense to manage playlist from here via search state and just send a 'audio:play' event over IPC with the relevant info
      done()
    }
  }
}
