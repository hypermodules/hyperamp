var { ipcRenderer } = require('electron')
var log = require('nanologger')('player')
var AudioPlayer = require('./audio-player')
var path = require('path')
// We don't need to sync-state since we just sync load state
var mainState = require('electron').remote.require('./index.js')
var needle = 'file://' + path.resolve(__dirname, 'needle.mp3')
var startupNode = document.querySelector('#needle')

needleSound(startupNode, needle, mainState)

var audioNode = document.querySelector('#audio')
var player = window.player = new AudioPlayer(audioNode, mainState)

player.on('*', function (event, data) {
  if (data === undefined) return log.info(event)
  log.info(event, data)
})

player.on('ended', function () {
  ipcRenderer.send('next')
})

player.on('timeupdate', function (time) {
  ipcRenderer.send('timeupdate', time)
})

ipcRenderer.on('queue', function (ev, newIndex) {
  player.queue(newIndex)
})

ipcRenderer.on('track-dict', function (ev, newTrackDict, newTrackOrder) {
  player.updateTrackDict(newTrackDict, newTrackOrder)
})

ipcRenderer.on('track-order', function (ev, newTrackOrder) {
  player.updateTrackOrder(newTrackOrder)
})

ipcRenderer.on('play', function (ev, data) {
  player.play()
})

ipcRenderer.once('play', function (ev, data) {
  startupNode.remove()
})

ipcRenderer.on('pause', function (ev, data) {
  player.pause()
})

ipcRenderer.on('volume', function (ev, lev) {
  player.volume(lev)
})

ipcRenderer.on('mute', function () {
  player.mute()
})

ipcRenderer.on('unmute', function () {
  player.unmute()
})

ipcRenderer.on('seek', function (ev, newTime) {
  player.seek(newTime)
})

function needleSound (node, file, state) {
  node.volume = state.volume
  node.muted = state.muted
  node.src = file
  node.play()
}
