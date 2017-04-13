var html = require('choo/html')
var styles = require('./styles')
var button = require('../button')
var buttonStyles = require('../button/styles')
// Implementer API
var CacheComponent = require('cache-component')

function Slider (opts) {
  if (!(this instanceof Slider)) return new Slider()
  if (!opts) opts = {}
  this._opts = Object.assign({
    min: 0,
    max: 1,
    default: 0.5,
    step: 0.01
  }, opts)
  this._vol = this._opts.default
  this._emit = null
  CacheComponent.call(this)
}
Slider.prototype = Object.create(CacheComponent.prototype)

Slider.prototype.handleInput = function (e) {
  this._emit('player:changeVolume', e.target.value)
}

Slider.prototype._render = function (vol, emit) {
  this._emit = emit
  this._vol = vol
  return html`
    <input id="volume" type='range'
        class='${styles.volumeControl}'
        min='${this._opts.min}' max='${this._opts.max}' step='${this._opts.step}'
        oninput=${this.handleInput.bind(this)}
        value='${vol}'>
  `
}

// Override default shallow compare _update function
Slider.prototype._update = function (vol, emit) {
  if (vol !== this._vol) {
    this._vol = vol
    this._element.value = this._vol
  }
  return false
}

var volumeSlider = new Slider()

function volume (state, emit) {
  return html`
    <div class='${buttonStyles.btnGroup}'>
      ${button({
        onclick: () => (state.player.muted ? emit('player:unmute') : emit('player:mute')),
        iconName: state.player.muted ? 'entypo-sound-mute' : 'entypo-sound'
      })}
      ${button({ className: styles.volumeButton }, volumeSlider.render(state.player.volume, emit))}
    </div>
  `
}

module.exports = volume
