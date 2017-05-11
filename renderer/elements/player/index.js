
var html = require('choo/html')
var styles = require('./styles')
var button = require('../button')
var buttonStyles = require('../button/styles')
var Component = require('cache-component')
var Range = require('../range')
var assert = require('assert')
var truthy = require('@bret/truthy')

module.exports = PlayerControls

function PlayerControls (opts) {
  if (!(this instanceof PlayerControls)) return new PlayerControls()
  if (!opts) opts = {}
  this._opts = Object.assign({
    min: 0,
    max: 100,
    step: 0.1,
    default: 0,
    id: 'position'
  }, opts)

  // State
  this._position = 0
  this._currentIndex = null
  this._emit = null
  this._playing = false
  this._disabled = false
  this._duration = 1

  // Bound Methods
  this._scalePosition = this._scalePosition.bind(this)
  this._handleSeek = this._handleSeek.bind(this)
  this._handlePrev = this._handlePrev.bind(this)
  this._handleNext = this._handleNext.bind(this)
  this._handlePlayPause = this._handlePlayPause.bind(this)

  // Owned Children
  this._positionSlider = new Range(this._opts)

  Component.call(this)
}

PlayerControls.prototype = Object.create(Component.prototype)

PlayerControls.prototype._scalePosition = function (position, duration) {
  return (position / duration) * this._opts.max || 0
}

PlayerControls.prototype._handleSeek = function (val) {
  this._emit('player:seek', (val / this._opts.max) * this._duration)
}

PlayerControls.prototype._handlePrev = function () {
  this._emit('player:prev')
}

PlayerControls.prototype._handleNext = function () {
  this._emit('player:next')
}

PlayerControls.prototype._handlePlayPause = function () {
  if (this._playing) this._emit('player:pause')
  else this._emit('player:play')
}

PlayerControls.prototype._render = function (state, emit) {
  assert.equal(typeof emit, 'function', 'PlaybackCluster: emit should be a function')
  this._emit = emit
  this._currentIndex = state.player.currentIndex
  this._playing = state.player.playing
  this._position = state.player.currentTime
  var key = state.library.trackOrder[this._currentIndex]
  var track = state.library.trackDict[key]
  this._disabled = !truthy(state.player.currentIndex)
  if (track) this._duration = track.duration

  return html`
    <div class='${styles.controls}'>
      ${button({ className: styles.scrubberControl },
        this._positionSlider.render({
          onchange: this._handleSeek,
          value: track ? this._scalePosition(this._position, track.duration) : 0,
          className: styles.scrubber,
          disabled: this._disabled
        })
      )}
      <div class="${buttonStyles.btnGroup} ${styles.trackControls}">
        ${button({
          onclick: this._handlePrev,
          iconName: 'entypo-controller-fast-backward'
        })}
        ${button({
          onclick: this._handlePlayPause,
          iconName: `entypo-controller-${this._playing ? 'paus' : 'play'}`
        })}
        ${button({
          onclick: this._handleNext,
          iconName: 'entypo-controller-fast-forward'
        })}
      </div>
    </div>
`
}

PlayerControls.prototype._update = function (state, emit) {
  this._emit = emit
  if (this._currentIndex !== state.player.currentIndex) return true
  if (this._playing !== state.player.playing) return true
  if (this._position !== state.player.currentTime) return true
  if (this._disabled !== truthy(state.player.currentIndex)) return true
  return false
}
