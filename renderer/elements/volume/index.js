var html = require('choo/html')
var styles = require('./styles')
var button = require('../button')
var buttonStyles = require('../button/styles')
var Component = require('cache-component')
var Range = require('../range')

var volOpts = {
  min: 0,
  max: 1,
  default: 0.5,
  step: 0.01,
  id: 'volume'
}

function VolumeCluster (/* opts */) {
  if (!(this instanceof VolumeCluster)) return new VolumeCluster()
  // if (!opts) opts = {}
  // this._opts = Object.assign({}, opts)
  this._volumeSlider = new Range(volOpts)
  this._emit = null
  this._volume = 0
  this._muted = false

  this._changeVolume = this._changeVolume.bind(this)
  this._toggleMute = this._toggleMute.bind(this)
  Component.call(this)
}

VolumeCluster.prototype = Object.create(Component.prototype)

VolumeCluster.prototype._changeVolume = function (volume) {
  if (this._emit) this._emit('player:changeVolume', volume)
}

VolumeCluster.prototype._toggleMute = function () {
  this._muted ? this._emit('player:unmute') : this._emit('player:mute')
}

VolumeCluster.prototype._render = function (state, emit) {
  var { muted, volume } = state.player
  this._muted = muted
  this._volume = volume
  this._emit = emit
  return html`
    <div class='${buttonStyles.btnGroup}'>
      ${button({
        onclick: this._toggleMute,
        iconName: muted ? 'entypo-sound-mute' : 'entypo-sound'
      })}
      ${button(
        { className: styles.volumeButton },
          this._volumeSlider({
            onchange: this._changeVolume,
            value: volume,
            className: styles.volumeSlider
          })
        )
      }
    </div>
  `
}

VolumeCluster.prototype._render = function (sate, emit) {
  var { muted, volume } = state.player
}

module.exports = volume
