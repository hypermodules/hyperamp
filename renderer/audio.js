var { ipcRenderer } = require('electron')
var audio = document.querySelector('#audio')
var path = require('path')
var startup = 'file://' + path.resolve(__dirname, '..', 'static', 'needle.mp3')
var lastVolume = null

// Warm up our needle
queue({ filepath: startup })
audio.play()

function queue (data) {
  console.log('audio: queue', data)
  if (data && data.filepath) audio.src = data.filepath
}

ipcRenderer.on('queue', function (ev, meta) {
  queue(meta)
})

ipcRenderer.on('play', function (ev, data) {
  console.log('audio: play')
  audio.play()
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

audio.addEventListener('ended', function () {
  console.log('audio: playback ended: ' + audio.src)
  ipcRenderer.send('next')
})
