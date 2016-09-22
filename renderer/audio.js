const { ipcRenderer } = require('electron')
const audio = document.querySelector('#audio')
var path = require('path')
const startup = 'file://' + path.resolve(__dirname, '..', 'static', 'needle.mp3')

play({ filepath: startup })

ipcRenderer.on('audio', function (e, type) {
  let args = [].slice.call(arguments, 2)

  if (type === 'play') return play.apply(null, args)
  if (type === 'pause') return pause.apply(null, args)
  if (type === 'volume') return volume.apply(null, args)
})

function play (data) {
  console.log('audio: play', data)
  if (data && data.filepath) audio.src = data.filepath
  audio.play()
}

function pause () {
  console.log('audio: pause')
  audio.pause()
}

function volume (data) {
  console.log('audio: volume')
  audio.volume = data.volume
}
