const { ipcRenderer } = require('electron')
const log = require('nanologger')('player')
const AudioPlayer = require('./audio-player')
const remote = require('@electron/remote')
const path = require('path')
// We don't need to sync-state since we just sync load state
const mainState = remote.require('./index.js')
const needle = 'file://' + path.resolve(__dirname, 'needle.mp3')
let startupNode = document.querySelector('#needle')
const fileUrlFromPath = require('../shared/file-url')

needleSound(startupNode, needle, mainState.volume, mainState.muted)

const audioNode = document.querySelector('#audio')
const player = window.player = new AudioPlayer(audioNode, mainState)

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

ipcRenderer.on('new-track', function (ev, track = {}) {
  // Might need to switch on different path format processing
  const src = fileUrlFromPath(track.filepath)
  player.load(src)
})

ipcRenderer.on('play', function (ev, data) {
  player.play()
})

ipcRenderer.once('play', function (ev, data) {
  startupNode.remove()
  startupNode = null
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

function needleSound (node, file, volume, muted) {
  node.volume = volume
  node.muted = muted
  node.src = file
  node.play()
}
