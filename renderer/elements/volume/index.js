var html = require('choo/html')
var styles = require('./styles')
var button = require('../button')
var buttonStyles = require('../button/styles')
var Component = require('cache-component')
var Range = require('../range')

function VolumeCluster (opts) {
  if (!(this instanceof VolumeCluster)) return new VolumeCluster(opts)
  if (!opts) opts = {}
  this._opts = Object.assign({
    min: 0,
    max: 1,
    default: 0.5,
    step: 0.01
  }, opts)

  // State
  this._emit = null
  this._volume = 0
  this._muted = false

  // Bound Methods
  this._changeVolume = this._changeVolume.bind(this)
  this._toggleMute = this._toggleMute.bind(this)

  // Owned Children
  this._volumeSlider = new Range(this._opts)

  Component.call(this)
}

VolumeCluster.prototype = Object.create(Component.prototype)

VolumeCluster.prototype._changeVolume = function (volume) {
  this._volume = volume
  if (this._emit) this._emit('player:changeVolume', volume)
}

VolumeCluster.prototype._toggleMute = function () {
  if (this._muted) this._emit('player:unmute')
  else this._emit('player:mute')
}

VolumeCluster.prototype._render = function (state, emit) {
  var { muted, volume } = state.player
  this._muted = muted
  this._volume = volume
  this._emit = emit
  return html`
    <div id="volume-cluster" class='${buttonStyles.btnGroup} ${styles.volumeCluster}'>
      ${button({
        onclick: this._toggleMute,
        iconName: muted ? 'entypo-sound-mute' : 'entypo-sound'
      })}
      ${button(
        { className: styles.volumeButton },
          this._volumeSlider.render({
            onchange: this._changeVolume,
            value: volume,
            className: styles.volumeSlider
          })
        )
      }
    </div>
  `
}

VolumeCluster.prototype._update = function (state) {
  var { muted, volume } = state.player
  if (this._muted !== muted || this._volume !== volume) {
    return true
  }
  return false
}

module.exports = VolumeCluster
