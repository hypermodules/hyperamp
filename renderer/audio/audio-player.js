var Nanobus = require('nanobus')
var window = require('global/window')
var setTimeout = window.setTimeout
var clearTimeout = window.clearTimeout
var fileUrlFromPath = require('file-url')
var path = require('path')

module.exports = AudioPlayer

function AudioPlayer (audioNode, state) {
  if (!(this instanceof AudioPlayer)) return new AudioPlayer(audioNode, state)
  Nanobus.call(this, 'hyperaudio')

  var self = this

  this.audio = audioNode
  this.trackDict = state.trackDict
  this.trackOrder = state.trackOrder
  this.currentIndex = state.currentIndex
  this.queue(state.currentIndex)
  this.audio.volume = state.volume
  this.audio.muted = state.muted
  this.seeking = false
  this.seekDebounceTimer = null
  this.timeupdate = null

  this._endedListener = this.audio.addEventListener('ended', function () {
    if (!self.seeking) self.emit('ended')
  })

  this._timeListener = this.audio.addEventListener('timeupdate', function (ev) {
    if (self.seeking) return
    var timeupdate = Math.floor(self.audio.currentTime)
    if (self.timeupdate === timeupdate) return
    self.timeupdate = timeupdate
    self.emit('timeupdate', self.timeupdate)
  })

  this.emit('initialized', this)
}

AudioPlayer.prototype = Object.create(Nanobus.prototype)

AudioPlayer.prototype.seekDebounce = function () {
  this.seeking = true
  if (this.seekDebounceTimer) clearTimeout(this.seekDebounceTimer)
  var self = this
  this.seekDebounceTimer = setTimeout(function () {
    self.emit('debounce cleared')
    self.seeking = false
    self.seekDebounceTimer = null
    // TODO: check if we are at the end and we lost the endedEvent
  }, 1000)
}

AudioPlayer.prototype.queue = function (newIndex) {
  this.currentIndex = newIndex
  var key = this.trackOrder[this.currentIndex]
  var track = this.trackDict[key]
  this.emit('queued', track)
  if (track && track.filepath) this.audio.src = fileUrlFromPath(track.filepath)
}

AudioPlayer.prototype.play = function () {
  this.emit('playing')
  this.audio.play()
  if (this.audio.currentTime === 0) this.notify()
}

AudioPlayer.prototype.pause = function () {
  this.emit('paused')
  this.audio.pause()
}

AudioPlayer.prototype.volume = function (lev) {
  this.emit('volume', lev)
  this.audio.volume = lev
}

AudioPlayer.prototype.mute = function () {
  this.emit('muted')
  this.audio.muted = true
}

AudioPlayer.prototype.unmute = function () {
  this.emit('unmuted')
  this.audio.muted = false
}

AudioPlayer.prototype.seek = function (newTime) {
  this.seekDebounce()
  this.emit('seek', newTime)
  this.audio.currentTime = newTime
}

AudioPlayer.prototype.updateTrackDict = function (trackDict, trackOrder) {
  this.emit('updateTrackDict', arguments)
  this.trackDict = trackDict
  this.trackOrder = trackOrder
}

AudioPlayer.prototype.updateTrackOrder = function (trackOrder) {
  this.emit('updateTrackOrder', arguments)
  this.trackOrder = trackOrder
}

AudioPlayer.prototype.notify = function () {
  var key = this.trackOrder[this.currentIndex]
  var track = this.trackDict[key]
  var artwork = fileUrlFromPath(track.artwork ? track.artwork : path.resolve(__dirname, '../../static/splash-mini.png'))

  new window.Notification(track.title, { // eslint-disable-line no-new
    // TODO: placeholder. ideally this is album art
    icon: artwork,
    title: track.title,
    body: track.artist[0],
    tag: 'nowPlaying',
    silent: true,
    requireInteraction: false
  })
}
