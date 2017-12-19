var Component = require('nanocomponent')
var html = require('choo/html')
var button = require('../button')
var bts = require('../button/styles')
var css = require('csjs-inject')

var styles = css`
  .controls {
    font-size: 1.5em;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-self: center;
    display: flex;
    flex-direction: row;
  }
`

class PlayerControls extends Component {
  constructor (opts) {
    super(opts)

    // State
    this.key = null
    this.emit = null
    this.playing = false

    // Bound Methods
    this.handlePrev = this.handlePrev.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handlePlayPause = this.handlePlayPause.bind(this)
    this.shuffleToggle = this.shuffleToggle.bind(this)
  }

  handlePrev () { this.emit('player:prev') }
  handleNext () { this.emit('player:next') }

  handlePlayPause () {
    if (this.playing) this.emit('player:pause')
    else this.emit('player:play')
  }

  shuffleToggle () {
    if (this.shuffling) this.emit('player:unshuffle')
    else this.emit('player:shuffle')
  }

  createElement (state, emit) {
    var { playing, shuffling, currentTrack = {} } = state.player

    this.emit = emit
    this.key = currentTrack.key
    this.playing = playing
    this.shuffling = shuffling

    return html`
      <div class=${styles.controls} ${bts.btnGroup}>
        ${button({
          onclick: this.handlePrev,
          iconName: 'entypo-controller-fast-backward'
        })}
        ${button({
          onclick: this.handlePlayPause,
          iconName: `entypo-controller-${this.playing ? 'paus' : 'play'}`
        })}
        ${button({
          onclick: this.handleNext,
          iconName: 'entypo-controller-fast-forward'
        })}
        ${button({
          onclick: this.shuffleToggle,
          iconName: 'entypo-shuffle',
          className: shuffling ? bts.active : null
        })}
      </div>
  `
  }

  update (state, emit) {
    var { currentTrack = {}, playing, shuffling } = state.player
    this.emit = emit
    if (this.key !== currentTrack.key) return true
    if (this.playing !== playing) return true
    if (this.shuffling !== shuffling) return true
    return false
  }
}

module.exports = PlayerControls
