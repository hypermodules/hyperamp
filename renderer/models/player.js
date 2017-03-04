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
      ipcRenderer.send('play', data)
      send('player:playing', { playing: true, current: data }, done)
    },
    pause: (state, data, send, done) => {
      ipcRenderer.send('pause')
      send('player:playing', { playing: false }, done)
    },
    prev: (state, data, send, done) => {
      ipcRenderer.send('prev')
      done()
    },
    next: (state, data, send, done) => {
      ipcRenderer.send('next')
      done()
    },
    updatePlaylist: (state, data, send, done) => {
      ipcRenderer.send('playlist', data)
      done()
    }
  },
  subscriptions: {
    play: (send, done) => {
      ipcRenderer.on('play', (ev, meta) => {
        send('player:playing', { playing: true, current: meta }, done)
      })
    },
    pause: (send, done) => {
      ipcRenderer.on('pause', (ev, meta) => {
        send('player:playing', {playing: false, current: meta}, done)
      })
    }
  }
}
