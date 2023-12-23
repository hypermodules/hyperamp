/* eslint-env browser */
const Nanobus = require('nanobus')
const window = require('global/window')
const get = require('lodash.get')
const fs = require('fs').promises
const fileUrlFromPath = require('../shared/file-url')
const setTimeout = window.setTimeout
const clearTimeout = window.clearTimeout

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
    this.currentTrack = null // Store current track

    this._endedListener = this.audio.addEventListener('ended',
      () => { if (!this.seeking) this.emit('ended') })

    this._timeListener = this.audio.addEventListener('timeupdate', (ev) => {
      if (this.seeking) return
      const timeupdate = Math.floor(this.audio.currentTime)
      if (this.timeupdate === timeupdate) return
      this.timeupdate = timeupdate
      this.emit('timeupdate', this.timeupdate)
    })

    this._initMediaSession()

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

  load (track) {
    this.currentTrack = track // Update current track
    this._updateMediaSessionMetadata()
    const src = fileUrlFromPath(track.filepath)
    this.emit('loading', src)
    this.audio.src = src || ''
  }

  play () {
    this.emit('playing')
    this.audio.play()
    navigator.mediaSession.playbackState = 'playing'
  }

  pause () {
    this.emit('paused')
    this.audio.pause()
    navigator.mediaSession.playbackState = 'paused'
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

  nextTrack () {
    this.emit('next')
  }

  previousTrack () {
    this.emit('prev')
  }

  _initMediaSession () {
    navigator.mediaSession.setActionHandler('play', () => this.play())
    navigator.mediaSession.setActionHandler('pause', () => this.pause())
    navigator.mediaSession.setActionHandler('previoustrack', () => this.previousTrack())
    navigator.mediaSession.setActionHandler('nexttrack', () => this.nextTrack())
    navigator.mediaSession.setActionHandler('seekbackward', () => this.seek(this.audio.currentTime - 10)) // Example: seek back 10 seconds
    navigator.mediaSession.setActionHandler('seekforward', () => this.seek(this.audio.currentTime + 10)) // Example: seek forward 10 seconds
  }

  _updateMediaSessionMetadata () {
    if (this.currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: this.currentTrack.title,
        artist: this.currentTrack.artist,
        album: this.currentTrack.album
        // artwork: [{ src: fileUrlFromPath(this.currentTrack.artwork), sizes: '96x96', type: 'image/png' }]
      })
    }
  }

  async _updateArtwork (trackWithArt) {
    if (this.currentTrack?.filepath === trackWithArt?.filepath && trackWithArt?.artwork) {
      this.currentTrack = trackWithArt
      const blob = await fileToBlobUrl(trackWithArt?.artwork)
      if (blob) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: this.currentTrack.title,
          artist: this.currentTrack.artist,
          album: this.currentTrack.album,
          artwork: [{ src: blob, sizes: '96x96', type: 'image/png' }]
        })
      }
    }
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

async function fileToBlobUrl (filePath) {
  try {
    // Read file as buffer
    const buffer = await fs.readFile(filePath)

    // Convert buffer to blob (Electron specific)
    const blob = new Blob([buffer], { type: 'image/png' }) // Adjust type based on your file's MIME type

    // Create a blob URL (in renderer process of Electron)
    const blobUrl = URL.createObjectURL(blob)

    return blobUrl
  } catch (error) {
    console.error('Error converting file to Blob URL:', error)
    return null
  }
}
