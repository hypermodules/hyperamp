var Nanobus = require('nanobus')

module.exports = AudioPlayer

function AudioPlayer (audioNode, state) {
  if (!(this instanceof AudioPlayer)) return new AudioPlayer()
  Nanobus.call(this)

  var self = this

  this.audio = audioNode
  this.current = state.current
  this.queue(state.current)
  this.audio.volume = state.volume
  this.audio.muted = state.muted
  this.seeking = false
  this.seekDebounceTimer = null

  this._endedListener = this.audio.addEventListener('ended', function () {
    if (!self.seekig) self.emit('ended')
  })

  this._timeListener = this.audio.addEventListener('timeupdate', function (ev) {
    if (!self.seekig) {
      self.emit('timeupdate', self.audio.currentTime)
      this.emit('timeupdate', self.audio.currentTime)
    }
  })
}
AudioPlayer.prototype = Object.create(Nanobus.prototype)

AudioPlayer.seekDebounce = function () {
  this.seeking = true
  if (this.seekDebounceTimer) this.seekDebounceTimer.stop()
  var self = this
  this.seekDebounceTimer = setTimeout(function () {
    self.seeking = false
    self.seekDebounceTimer = null
    // TODO: check if we are at the end and we lost the endedEvent
  }, 1000)
}

AudioPlayer.prototype.queue = function (data) {
  this.emit('queued', data)
  this.current = data
  if (data && data.filepath) this.audio.src = data.filepath
}

AudioPlayer.prototype.play = function () {
  this.emit('playing')
  this.audio.play()
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
