var { ipcRenderer } = require('electron')
var audio = document.querySelector('#audio')
var path = require('path')
var startup = 'file://' + path.resolve(__dirname, '..', 'static', 'needle.mp3')
var mainState = require('electron').remote.require('./index.js')

var state = {
  muted: mainState.muted
}

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

ipcRenderer.on('volume', function (ev, volume) {
  console.log(`audio: volume ${volume}`)
  state.volume = volume
  if (!state.muted) audio.volume = volume
})

ipcRenderer.on('mute', function () {
  audio.volume = 0
  state.muted = true
  console.log(`audio: mute on`)
})

ipcRenderer.on('unmute', function () {
  audio.volume = state.volume
  state.muted = false
  console.log(`audio: mute off`)
})

audio.addEventListener('ended', function () {
  console.log('audio: playback ended: ' + audio.src)
  ipcRenderer.send('next')
})

audio.addEventListener('timeupdate', function (ev) {
  console.log('audio: currentTime: ' + audio.currentTime)
  ipcRenderer.send('timeupdate', audio.currentTime)
})
