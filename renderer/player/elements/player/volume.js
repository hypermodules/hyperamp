var html = require('choo/html')
var button = require('../button')
var buttonStyles = require('../button/styles')
var Component = require('nanocomponent')
var Range = require('../range')
var css = require('csjs-inject')

var styles = css`
  .volumeGroup {
    flex: 1 1 30%;
    max-width: 110px;
    min-width: 80px;
  }
  .volumeButton { padding-right: 0 }
  .range {
    width: 100%;
    padding: 0 3px;
  }
  .volumeSlider {
    position: relative;
    cursor: default;
    display: inline-block;
    vertical-align: middle;
    -webkit-app-region: no-drag;
    margin: 0 5px;
    width: 100%;
  }
`

class Volume extends Component {
  constructor (opts) {
    if (!opts) opts = {}
    super(opts)
    this.opts = Object.assign({
      min: 0,
      max: 1,
      default: 0.5,
      step: 0.01
    }, opts)

    // State
    this.emit = null
    this.volume = 0
    this.muted = false

    // Bound Methods
    this.changeVolume = this.changeVolume.bind(this)
    this.toggleMute = this.toggleMute.bind(this)

    // Owned Children
    this.volumeSlider = new Range(this.opts)
  }

  changeVolume (volume) {
    this.volume = volume
    if (this.emit) this.emit('player:changeVolume', volume)
  }

  toggleMute () {
    if (this.muted) this.emit('player:unmute')
    else this.emit('player:mute')
  }

  createElement (state, emit) {
    var { muted, volume } = state.player
    this.muted = muted
    this.volume = volume
    this.emit = emit
    return html`
      <div class="${buttonStyles.btnGroup} ${styles.volumeGroup}">
        ${button({/* eslint-disable indent */
          onclick: this.toggleMute,
          iconName: muted ? 'entypo-sound-mute' : 'entypo-sound',
          className: styles.volumeButton
        })}
        ${button({ className: styles.range },
          this.volumeSlider.render({
            onchange: this.changeVolume,
            value: volume,
            className: styles.volumeSlider
          })
        )/* eslint-enable indent */}
      </div>
    `
  }

  update (state) {
    var { muted, volume } = state.player
    if (this.muted !== muted || this.volume !== volume) {
      return true
    }
    return false
  }
}

module.exports = Volume
