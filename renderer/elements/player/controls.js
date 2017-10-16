var Component = require('nanocomponent')
var html = require('choo/html')
var button = require('../button')
var buttonStyles = require('../button/styles')
var css = require('csjs-inject')

var styles = css`
  .controls {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-self: center;
    display: flex;
    flex-direction: row;
  }
  .ctrlBtn {
    padding: 3px;
    font-size: 1.25rem;
  }
  .playBtn { font-size: 1.5rem }
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
      <div class=${styles.controls} ${buttonStyles.btnGroup}>
        ${button({
          onclick: this.handlePrev,
          iconName: 'entypo-controller-fast-backward',
          className: styles.ctrlBtn
        })}
        ${button({
          onclick: this.handlePlayPause,
          iconName: `entypo-controller-${this.playing ? 'paus' : 'play'}`,
          className: [styles.playBtn, styles.ctrlBtn].join(' ')
        })}
        ${button({
          onclick: this.handleNext,
          iconName: 'entypo-controller-fast-forward',
          className: styles.ctrlBtn
        })}
        ${button({
          onclick: this.shuffleToggle,
          iconName: 'entypo-shuffle',
          className: shuffling ? buttonStyles.active : null
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
