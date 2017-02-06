const { ipcRenderer } = require('electron')
const audio = document.querySelector('#audio')
var path = require('path')
const startup = 'file://' + path.resolve(__dirname, '..', 'static', 'needle.mp3')

play({ filepath: startup })

function play (data) {
  console.log('audio: play', data)
  if (data && data.value && data.value.filepath) audio.src = data.value.filepath
  audio.play()
}

ipcRenderer.on('play', function (ev, data) {
  play(data)
})

ipcRenderer.on('pause', function (ev, data) {
  console.log('audio: pause')
  audio.pause()
})

ipcRenderer.on('volume', function (ev, data) {
  console.log('audio: volume')
  audio.volume = data.volume
})
