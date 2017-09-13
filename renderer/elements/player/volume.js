var html = require('choo/html')
var styles = require('./styles')
var button = require('../button')
var buttonStyles = require('../button/styles')
var Component = require('nanocomponent')
var Range = require('../range')

class Volume extends Component {
  constructor (opts) {
    if (!opts) opts = {}
    super(opts)
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
  }

  _changeVolume (volume) {
    this._volume = volume
    if (this._emit) this._emit('player:changeVolume', volume)
  }

  _toggleMute () {
    if (this._muted) this._emit('player:unmute')
    else this._emit('player:mute')
  }

  createElement (state, emit) {
    var { muted, volume } = state.player
    this._muted = muted
    this._volume = volume
    this._emit = emit
    return html`
      <div class="${buttonStyles.btnGroup} ${styles.volumeGroup}">
        ${button({
          onclick: this._toggleMute,
          iconName: muted ? 'entypo-sound-mute' : 'entypo-sound'
        })}
        ${button({ className: styles.volumeButton },
          this._volumeSlider.render({
            onchange: this._changeVolume,
            value: volume,
            className: styles.volumeSlider
          })
        )}
      </div>
    `
  }

  update (state) {
    var { muted, volume } = state.player
    if (this._muted !== muted || this._volume !== volume) {
      return true
    }
    return false
  }
}

module.exports = Volume
