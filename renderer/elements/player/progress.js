var Component = require('nanocomponent')
var html = require('choo/html')
var truthy = require('@bret/truthy')
var styles = require('./styles')
var button = require('../button')
var Range = require('../range')
var fd = require('format-duration')

class Progress extends Component {
  constructor (opts) {
    if (!opts) opts = {}
    super(opts)
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
    this._disabled = false
    this._duration = 1

    // Bound Methods
    this._scalePosition = this._scalePosition.bind(this)
    this._handleSeek = this._handleSeek.bind(this)

    // Owned Children
    this._positionSlider = new Range(this._opts)
  }

  _scalePosition (position, duration) {
    return (position / duration) * this._opts.max || 0
  }

  _handleSeek (val) {
    var newTime = (val / this._opts.max) * this._duration
    this._emit('player:seek', newTime)
    this._position = newTime
  }

  createElement (state, emit) {
    var { currentIndex, currentTime } = state.player
    var { trackOrder, trackDict } = state.library

    this._emit = emit
    this._currentIndex = currentIndex
    this._position = currentTime
    this._disabled = !truthy(currentIndex)

    var key = trackOrder[this._currentIndex]
    var track = trackDict[key]

    if (track) this._duration = track.duration

    return html`
      <div class=${styles.progress}>
        <div class=${styles.time}>${fd(this._position * 1000)}</div>
        ${button({ className: styles.range },
          this._positionSlider.render({
            onchange: this._handleSeek,
            value: track ? this._scalePosition(this._position, track.duration) : 0,
            className: styles.scrubber,
            disabled: this._disabled
          })
        )}
        <div class=${styles.time}>${fd(this._duration * 1000)}</div>
      </div>
    `
  }

  update (state, emit) {
    this._emit = emit
    if (this._currentIndex !== state.player.currentIndex) return true
    if (this._position !== state.player.currentTime) return true
    if (this._disabled !== truthy(state.player.currentIndex)) return true
    return false
  }
}

module.exports = Progress
