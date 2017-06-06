var html = require('choo/html')
// var debounce = require('lodash.debounce')
// var fd = require('format-duration')
var styles = require('./styles')
var artworkCache = require('../../lib/artwork-cache')
var Component = require('cache-component')
var Volume = require('../volume')
var PlayerControls = require('../player')
var Meta = require('../meta')

function Footer (opts) {
  if (!(this instanceof Footer)) return new Footer()
  if (!opts) opts = {}
  this._opts = Object.assign({}, opts)

  // state
  this._emit = null
  this._currentIndex = null
  this._pictureHash = null

  // owned children
  this._playerControls = new PlayerControls()
  this._volume = new Volume()
  this._meta = new Meta()

  Component.call(this)
}

Footer.prototype = Object.create(Component.prototype)

Footer.prototype._render = function (state, emit) {
  this._emit = emit
  this._currentIndex = state.player.currentIndex
  var key = state.library.trackOrder[this._currentIndex]
  var {title = '--', artist = '--', album = '--'} = state.library.trackDict[key] || {}
  this._pictureHash = state.player.pictureHash
  var backgroundImg = artworkCache[this._pictureHash]

  return html`
      <div class="${styles.footer}">
        <div class="${styles.track}">
          <div class="${styles.albumCover}">
            <div class="${styles.albumArt}"
              style="background-image: ${backgroundImg ? 'url(' + backgroundImg + ')' : ''}">
            </div>
          </div>
          ${this._meta.render(title, artist, album)}
          ${this._playerControls.render(state, emit)}
        </div>
        ${this._volume.render(state, emit)}
      </div>
    `
}

Footer.prototype._update = function (state, emit) {
  this._emit = emit
  if (this._currentIndex !== state.player.currentIndex) return true
  // if (this._pictureHash !== state.player.pictureHash) return true
  if (this._volume._update(state, emit)) return true
  if (this._playerControls._update(state, emit)) return true
  return false
}

// <div>${fd(state.player.currentTime * 1000)} -${fd((state.player.current.duration - state.player.currentTime) * 1000)}</div>

module.exports = Footer
