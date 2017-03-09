var { ipcRenderer } = require('electron')

module.exports = {
  namespace: 'player',
  state: {
    playing: false,
    current: null,
    volume: 100,
    mute: false,
    position: 0
  },
  reducers: {
    mute: (state, data) => {
      ipcRenderer.send('audio', 'mute')
      return { mute: !state.mute }
    },
    playing: (state, data) => ({playing: data}),
    position: (state, data) => data,
    volume: (state, data) => {
      ipcRenderer.send('audio', 'volume', data)
      return data
    },
    current: (state, data) => ({current: data})
  },
  effects: {
    queue: (state, data, send, done) => {
      ipcRenderer.send('queue', data)
      send('player:current', data, done)
    },
    play: (state, data, send, done) => {
      ipcRenderer.send('play')
      send('player:playing', true, done)
    },
    pause: (state, data, send, done) => {
      ipcRenderer.send('pause')
      send('player:playing', false, done)
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
      ipcRenderer.on('play', (ev) => {
        send('player:playing', true, done)
      })
    },
    pause: (send, done) => {
      ipcRenderer.on('pause', (ev) => {
        send('player:playing', false, done)
      })
    },
    queue: (send, done) => {
      ipcRenderer.on('queue', (ev, meta) => {
        send('player:current', meta, done)
      })
    }
  }
}
