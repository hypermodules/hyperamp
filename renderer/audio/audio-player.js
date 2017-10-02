var Nanobus = require('nanobus')
var window = require('global/window')
var get = require('lodash.get')
var setTimeout = window.setTimeout
var clearTimeout = window.clearTimeout

class AudioPlayer extends Nanobus {
  constructor (audioNode, state) {
    super('Hyperaudio')

    this.audio = audioNode
    this.audio.volume = state.volume
    this.audio.muted = state.muted
    this.audio.src = get(state.al, 'currentTrack.filepath') || ''
    this.seeking = false
    this.seekDebounceTimer = null
    this.timeupdate = null

    this._endedListener = this.audio.addEventListener('ended',
      () => { if (!this.seeking) this.emit('ended') })

    this._timeListener = this.audio.addEventListener('timeupdate', (ev) => {
      if (this.seeking) return
      var timeupdate = Math.floor(this.audio.currentTime)
      if (this.timeupdate === timeupdate) return
      this.timeupdate = timeupdate
      this.emit('timeupdate', this.timeupdate)
    })

    this.emit('initialized', this)
  }

  seekDebounce () {
    this.seeking = true
    if (this.seekDebounceTimer) clearTimeout(this.seekDebounceTimer)
    this.seekDebounceTimer = setTimeout(() => {
      this.emit('debounce cleared')
      this.seeking = false
      this.seekDebounceTimer = null
    // TODO: check if we are at the end and we lost the endedEvent
    }, 1000)
  }

  load (src) {
    this.emit('loading', src)
    this.audio.src = src || ''
  }

  play () {
    this.emit('playing')
    this.audio.play()
  }

  pause () {
    this.emit('paused')
    this.audio.pause()
  }

  volume (lev) {
    this.emit('volume', lev)
    this.audio.volume = lev
  }

  mute () {
    this.emit('muted')
    this.audio.muted = true
  }

  unmute () {
    this.emit('unmuted')
    this.audio.muted = false
  }

  seek (newTime) {
    this.seekDebounce()
    this.emit('seek', newTime)
    this.audio.currentTime = newTime
  }
}

module.exports = AudioPlayer

// TODO: move to main thread
// function notify () {
//   var key = this.trackOrder[this.currentIndex]
//   var track = this.trackDict[key]
//   var artwork = fileUrlFromPath(track.artwork ? track.artwork : path.resolve(__dirname, '../../static/splash-mini.png'))
//
//   new window.Notification(track.title, { // eslint-disable-line no-new
//     // TODO: placeholder. ideally this is album art
//     icon: artwork,
//     title: track.title,
//     body: track.artist[0],
//     tag: 'nowPlaying',
//     silent: true,
//     requireInteraction: false
//   })
// }
