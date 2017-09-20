var html = require('choo/html')
var Component = require('nanocomponent')
var Controls = require('./controls')
var Progress = require('./progress')
var Volume = require('./volume')
var Meta = require('./meta')
var css = require('csjs-inject')

var styles = css`
  .player {
    -webkit-app-region: drag;
    border-top: var(--border);
    align-items: center;
    text-align: center;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 65px;
    justify-content: space-between;
    will-change: transform;
    contain: layout;
    display: flex;
    padding: 0 2% 0 0;
    background: var(--bg);
  }
`

class Player extends Component {
  constructor (opts) {
    if (!opts) opts = {}
    super(opts)
    this._opts = Object.assign({}, opts)

    // state
    this._emit = null
    this._key = null
    this._pictureHash = null

    // owned children
    this._controls = new Controls()
    this._progress = new Progress()
    this._volume = new Volume()
    this._meta = new Meta()
  }

  createElement (state, emit) {
    var { trackOrder, trackDict } = state.library
    var { artwork, currentIndex } = state.player

    this._emit = emit
    this._key = trackOrder[currentIndex]

    return html`
      <div class="${styles.player}">
        ${this._meta.render(trackDict[this._key] || {}, artwork)}
        ${this._controls.render(state, emit)}
        ${this._progress.render(state, emit)}
        ${this._volume.render(state, emit)}
      </div>
    `
  }

  update (state, emit) {
    this._emit = emit

    var { trackOrder, trackDict } = state.library
    var { artwork, currentIndex } = state.player

    if (this._key !== trackOrder[currentIndex]) return true

    this._controls.render(state, emit)
    this._progress.render(state, emit)
    this._volume.render(state, emit)
    this._meta.render(trackDict[this._key] || {}, artwork)

    return false
  }
}

module.exports = Player
