var html = require('choo/html')
// var debounce = require('lodash.debounce')
// var fd = require('format-duration')
var styles = require('./styles')
var artworkCache = require('../../lib/artwork-cache')
var Component = require('cache-component')
var Volume = require('../volume')
var PlayerControls = require('../player')

// This is an experiment using Class syntax

class Footer extends Component {
  constructor (height, width) {
    super()

    // state
    this._emit = null
    this._current = {}
    this._picture = null

    // owned children
    this._playerControls = new PlayerControls()
    this._volume = new Volume()
  }

  _render (state, emit) {
    this._emit = emit
    this._current = state.player.current
    var {title, artist, album} = this._current
    this._picture = state.player.picture
    var backgroundImg = artworkCache[this._picture]

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
          ${this._playerControls.render(state, emit)}
        </div>
        ${this._volume.render(state, emit)}
      </div>
    `
  }

  _update (state, emit) {
    this._emit = emit
    if (this._current !== state.player.current) return true
    if (this._picture !== state.player.picture) return true
    if (this._volume._update(state, emit)) return true
    if (this._playerControls._update(state, emit)) return true
    return false
  }
}

// <div>${fd(state.player.currentTime * 1000)} -${fd((state.player.current.duration - state.player.currentTime) * 1000)}</div>

module.exports = Footer
