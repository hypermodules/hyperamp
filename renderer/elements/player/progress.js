var Component = require('nanocomponent')
var html = require('choo/html')
var truthy = require('@bret/truthy')
var button = require('../button')
var Range = require('../range')
var fd = require('format-duration')
var css = require('csjs-inject')

var styles = css`
  .progress {
    display: flex;
    width: 100%;
    padding: 0 2%;
    justify-content: center;
  }
  .time {
    font-size: 11px;
    display: inline-flex;
    align-items: center;
    min-width: 3em;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }
  .time:first-child { justify-content: flex-end }
  .time:last-child { justify-content: flex-start }
  .range { width: 100% }
  .scrubber {
    cursor: default;
    position: relative;
    vertical-align: middle;
    -webkit-app-region: no-drag;
    width: 100%;
  }
  @media (max-width: 440px) {
    .range {
      width: 0;
      padding: 0 .5em 0 0;
      pointer-events: none;
    }
    .range::after {
      content: '/';
      margin-left: -.25em;
    }
  }
`

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
