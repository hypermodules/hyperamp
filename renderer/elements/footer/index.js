var html = require('choo/html')
// var debounce = require('lodash.debounce')
// var fd = require('format-duration')
var styles = require('./styles')
var artworkCache = require('../../lib/artwork-cache')
var PlaybackCluster = require('../playback')
var playbackCluster = new PlaybackCluster()

module.exports = (state, emit) => {
  var current = state.player.current || {}
  var title = current.title || null
  var artist = current.artist || null
  var album = current.album || null
  var backgroundImg = artworkCache[state.player.picture]
  return html`
    <footer class="${styles.footer}">
      <div
        style="background-image: ${state.player.picture ? 'url(' + backgroundImg + ')' : ''}"
        class="${styles.albumArt}">
      </div>
      <div class="${styles.meta}">
        <p class="${styles.title}">${title || 'No Track Selected'}</p>
        <p class="${styles.artist}">
          ${Array.isArray(artist) ? artist.join(', ') : artist || 'No Artist'}
          ${album != null && album !== '' ? ` - ${album}` : null}
        </p>
        ${playbackCluster.render(state, emit)}
      </div>
    </footer>
  `
}

// <div>${fd(state.player.currentTime * 1000)} -${fd((state.player.current.duration - state.player.currentTime) * 1000)}</div>
