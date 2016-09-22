const { ipcRenderer } = require('electron')
const audio = document.querySelector('#audio')
let playlist = []
let current = {}

ipcRenderer.on('audio', function (e, type) {
  let args = [].slice.call(arguments, 2)

  if (type === 'play') return play.apply(null, args)
  if (type === 'pause') return pause.apply(null, args)
  if (type === 'volume') return volume.apply(null, args)
  if (type === 'next') return next.apply(null, args)
})

audio.addEventListener('ended', next)

function play (data) {
  console.log('audio: play', data)
  if (data && data.filepath) {
    audio.src = data.filepath
    current = data
  } else if (!audio.src && playlist.length) {
    current = playlist[0]
  }
  audio.play()
}

function pause () {
  console.log('audio:pause', current)
  audio.pause()
}

function volume (data) {
  console.log('audio: volume')
  audio.volume = data.volume
}

function next () {
  console.log('audio: next')
  let index = playlist.map(i => i.filepath).indexOf(current.filepath) + 1
  if (playlist.length >= index) {
    current = null
    return audio.pause()
  }
  play(playlist[index])
}
