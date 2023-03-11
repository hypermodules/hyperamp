const Component = require('nanocomponent')
const html = require('choo/html')
const truthy = require('@bret/truthy')
const button = require('../button')
const Range = require('../range')
const fd = require('format-duration')
const css = require('csjs-inject')
const get = require('lodash.get')

const styles = css`
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
  @media (max-width: 640px) {
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
    this.opts = Object.assign({
      min: 0,
      max: 100,
      step: 0.1,
      default: 0,
      id: 'position'
    }, opts)

    // State
    this.position = 0
    this.currentIndex = null
    this.emit = null
    this.disabled = false
    this.duration = 1

    // Bound Methods
    this.scalePosition = this.scalePosition.bind(this)
    this.handleSeek = this.handleSeek.bind(this)

    // Owned Children
    this.positionSlider = new Range(this.opts)
  }

  scalePosition (position, duration) {
    return (position / duration) * this.opts.max || 0
  }

  handleSeek (val) {
    const newTime = (val / this.opts.max) * this.duration
    this.emit('player:seek', newTime)
    this.position = newTime
  }

  createElement (state, emit) {
    const { currentTrack, currentTime } = state.player

    this.emit = emit
    this.key = get(currentTrack, 'key')
    this.position = currentTime
    this.disabled = !truthy(currentTrack)

    if (currentTrack) this.duration = currentTrack.duration

    return html`
      <div class=${styles.progress}>
        <div class=${styles.time}>${fd(this.position * 1000)}</div>
        ${button({ className: styles.range }, /* eslint-disable indent */
          this.positionSlider.render({
            onchange: this.handleSeek,
            value: currentTrack ? this.scalePosition(this.position, currentTrack.duration) : 0,
            className: styles.scrubber,
            disabled: this.disabled
          })
        )/* eslint-enable indent */}
        <div class=${styles.time}>${fd(this.duration * 1000)}</div>
      </div>
    `
  }

  update (state, emit) {
    this.emit = emit
    if (this.disabled !== !truthy(state.player.currentTrack)) return true
    if (this.key !== get(state, 'player.currentTrack.key')) return true
    if (this.position !== state.player.currentTime) return true
    if (this.duration !== get(state, 'player.currentTrack.duration')) return true
    return false
  }
}

module.exports = Progress
