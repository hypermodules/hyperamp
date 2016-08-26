// TODO: move audio to a worker maybe? use IPC maybe?
const audio = document.querySelector('#audio')

module.exports = {
  namespace: 'player',
  state: {
    playing: false,
    filepath: null,
    volume: 100
  },
  reducers: {
    playing: (data, state) => {
      if (!data.filepath) {
        if (!data.playing) audio.pause()
        else audio.play()
      }

      return data
    },
    volume: (data, state) => {
      audio.volume = data
      return { volume: data }
    }
  },
  effects: {
    play: (data, state, send, done) => {
      let { filepath } = data
      audio.src = filepath
      audio.play()
      send('player:playing', {
        playing: true,
        filepath: filepath
      }, done)
    },
    prev: (data, state, send, done) => {
      console.log('not yet implemented')
      done()
    },
    next: (data, state, send, done) => {
      console.log('not yet implemented')
      done()
    }
  }
}
