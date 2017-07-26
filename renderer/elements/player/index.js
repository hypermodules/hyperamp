var html = require('choo/html')
// var fd = require('format-duration')
var styles = require('./styles')
var Component = require('nanocomponent')
var Volume = require('./volume')
var PlayerControls = require('./controls')
var Meta = require('./meta')
var Artwork = require('./artwork')

function Player (opts) {
  if (!(this instanceof Player)) return new Player(opts)
  if (!opts) opts = {}
  this._opts = Object.assign({}, opts)

  // state
  this._emit = null
  this._key = null
  this._pictureHash = null

  // owned children
  this._playerControls = new PlayerControls()
  this._volume = new Volume()
  this._meta = new Meta()
  this._artwork = new Artwork()

  Component.call(this)
}

Player.prototype = Object.create(Component.prototype)

Player.prototype.createElement = function (state, emit) {
  this._emit = emit
  var {currentIndex} = state.player
  this._key = state.library.trackOrder[currentIndex]
  var {title = '--', artist = '--', album = '--'} = state.library.trackDict[this._key] || {}
  var artworkPath = state.player.artwork

  return html`
      <div class="${styles.player}">
        <div class="${styles.track}">
          ${this._artwork.render(artworkPath)}
          ${this._meta.render(title, artist, album)}
          ${this._playerControls.render(state, emit)}
        </div>
        ${this._volume.render(state, emit)}
      </div>
    `
}

Player.prototype.update = function (state, emit) {
  this._emit = emit
  var artworkPath = state.player.artwork
  var {currentIndex} = state.player
  var key = state.library.trackOrder[currentIndex]
  if (this._key !== key) return true
  // if (this._pictureHash !== state.player.pictureHash) return true
  this._volume.render(state, emit)
  this._playerControls.render(state, emit)
  this._artwork.render(artworkPath)
  return false
}

// <div>${fd(state.player.currentTime * 1000)} -${fd((state.player.current.duration - state.player.currentTime) * 1000)}</div>

module.exports = Player
