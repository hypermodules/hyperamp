var html = require('choo/html')
var Component = require('nanocomponent')
var Add = require('../add')
var Controls = require('./controls')
var Progress = require('./progress')
var Volume = require('./volume')
var Meta = require('./meta')
var css = require('csjs-inject')

var styles = css`
  .player {
    -webkit-app-region: drag;
    align-items: center;
    text-align: center;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 39px;
    justify-content: space-between;
    will-change: transform;
    contain: layout;
    display: flex;
    padding: 0;
    background: var(--bg);
  }
  .audioControls {
    padding: 0 1% 0 6em;
    display: flex;
    justify-content: space-between;
    contain: layout;
    width: 100%;
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
    this._add = new Add()
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

    // ${this._meta.render(trackDict[this._key] || {}, artwork)}

    return html`
      <div class="${styles.player}">
        <div class="${styles.audioControls}">
          ${this._controls.render(state, emit)}
          ${this._progress.render(state, emit)}
          ${this._volume.render(state, emit)}
          ${this._add.render(state, emit)}
        </div>
      </div>
    `
  }

  update (state, emit) {
    this._emit = emit

    var { trackOrder, trackDict } = state.library
    var { artwork, currentIndex } = state.player

    if (this._key !== trackOrder[currentIndex]) return true

    this._add.render(state, emit)
    this._controls.render(state, emit)
    this._progress.render(state, emit)
    this._volume.render(state, emit)
    this._meta.render(trackDict[this._key] || {}, artwork)

    return false
  }
}

module.exports = Player
