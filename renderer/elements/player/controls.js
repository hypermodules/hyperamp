var Component = require('nanocomponent')
var html = require('choo/html')
var button = require('../button')
var buttonStyles = require('../button/styles')
var css = require('csjs-inject')

var styles = css`
  .controls {
    font-size: 1.25em;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-self: center;
    display: flex;
    flex-direction: row;
  }
  .ctrlBtn { padding: 3px }
  .playBtn { font-size: 1.5em }
`

class PlayerControls extends Component {
  constructor (opts) {
    super(opts)

    // State
    this._currentIndex = null
    this._emit = null
    this._playing = false

    // Bound Methods
    this._handlePrev = this._handlePrev.bind(this)
    this._handleNext = this._handleNext.bind(this)
    this._handlePlayPause = this._handlePlayPause.bind(this)
    this._shuffleToggle = this._shuffleToggle.bind(this)
  }

  _handlePrev () { this._emit('player:prev') }
  _handleNext () { this._emit('player:next') }

  _handlePlayPause () {
    if (this._playing) this._emit('player:pause')
    else this._emit('player:play')
  }

  _shuffleToggle () {
    if (this._shuffling) this._emit('player:unshuffle')
    else this._emit('player:shuffle')
  }

  createElement (state, emit) {
    var { playing, shuffling, currentIndex } = state.player

    this._emit = emit
    this._currentIndex = currentIndex
    this._playing = playing
    this._shuffling = shuffling

    return html`
      <div class=${styles.controls} ${buttonStyles.btnGroup}>
        ${button({
          onclick: this._handlePrev,
          iconName: 'entypo-controller-fast-backward',
          className: styles.ctrlBtn
        })}
        ${button({
          onclick: this._handlePlayPause,
          iconName: `entypo-controller-${this._playing ? 'paus' : 'play'}`,
          className: [styles.playBtn, styles.ctrlBtn].join(' ')
        })}
        ${button({
          onclick: this._handleNext,
          iconName: 'entypo-controller-fast-forward',
          className: styles.ctrlBtn
        })}
        ${button({
          onclick: this._shuffleToggle,
          iconName: 'entypo-shuffle',
          className: shuffling ? buttonStyles.active : null
        })}
      </div>
  `
  }

  update (state, emit) {
    this._emit = emit
    if (this._currentIndex !== state.player.currentIndex) return true
    if (this._playing !== state.player.playing) return true
    if (this._shuffling !== state.player.shuffling) return true
    return false
  }
}

module.exports = PlayerControls
