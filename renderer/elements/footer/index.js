var html = require('choo/html')
// var debounce = require('lodash.debounce')
// var fd = require('format-duration')
var styles = require('./styles')
var artworkCache = require('../../lib/artwork-cache')
var volume = require('../volume')()
var playerControls = require('../player')()

module.exports = (state, emit) => {
  var current = state.player.current || {}
  var title = current.title || null
  var artist = current.artist || null
  var album = current.album || null
  var backgroundImg = artworkCache[state.player.picture]
  return html`
    <div class="${styles.footer}">
      <div class="${styles.track}">
        <div class="${styles.albumCover}">
          <div class="${styles.albumArt}"
            style="background-image: ${state.player.picture ? 'url(' + backgroundImg + ')' : ''}">
          </div>
        </div>
        <div class="${styles.meta}">
          <p class="${styles.title}">${title || 'No Track Selected'}</p>
          <p class="${styles.artist}">
            ${Array.isArray(artist) ? artist.join(', ') : artist || 'No Artist'}
            ${album != null && album !== '' ? ` - ${album}` : null}
          </p>
        </div>
        ${playerControls.render(state, emit)}
      </div>

      ${volume.render(state, emit)}
    </div>
  `
}

// <div>${fd(state.player.currentTime * 1000)} -${fd((state.player.current.duration - state.player.currentTime) * 1000)}</div>
