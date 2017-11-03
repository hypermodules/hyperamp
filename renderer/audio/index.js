var { ipcRenderer } = require('electron')
var log = require('nanologger')('player')
var ipcLog = require('nanologger')('ipc')
var AudioPlayer = require('./audio-player')
var path = require('path')
// We don't need to sync-state since we just sync load state
var mainState = require('electron').remote.require('./index.js')
var needle = 'file://' + path.resolve(__dirname, 'needle.mp3')
var startupNode = document.querySelector('#needle')
var fileUrlFromPath = require('file-url')
var ipcLogger = require('electron-ipc-log')

ipcLogger(event => {
  var { channel, data, sent, sync } = event
  var args = [sent ? '⬆️' : '⬇️', channel, ...data]
  if (sync) args.unshift('sync')
  ipcLog.info(...args)
})

needleSound(startupNode, needle, mainState.volume, mainState.muted)

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

ipcRenderer.on('new-track', function (ev, track = {}) {
  // Might need to switch on different path format processing
  var src = fileUrlFromPath(track.filepath)
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
