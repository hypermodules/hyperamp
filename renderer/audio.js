var { ipcRenderer } = require('electron')
var audio = document.querySelector('#audio')
var path = require('path')
var startup = 'file://' + path.resolve(__dirname, '..', 'static', 'needle.mp3')
var lastVolume = null

play({ filepath: startup })

function play (data) {
  console.log('audio: play', data)
  if (data && data.filepath) audio.src = data.filepath
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
  console.log(`audio: volume${lastVolume ? ' (muted)' : ''}`, data.volume)
  if (lastVolume === null) audio.volume = data.volume
  else lastVolume = data.volume
})

ipcRenderer.on('mute', function () {
  var shouldMute = lastVolume === null

  if (shouldMute) {
    lastVolume = audio.volume
    audio.volume = 0
  } else {
    audio.volume = lastVolume
    lastVolume = null
  }

  console.log(`audio: mute ${shouldMute ? 'on' : 'off'}`)
})
