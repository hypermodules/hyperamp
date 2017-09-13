var html = require('choo/html')
var styles = require('./styles')
var Component = require('nanocomponent')
var Artwork = require('./artwork')
var Controls = require('./controls')
var Progress = require('./progress')
var Meta = require('./meta')
var Volume = require('./volume')

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
    this._artwork = new Artwork()
    this._controls = new Controls()
    this._progress = new Progress()
    this._meta = new Meta()
    this._volume = new Volume()
  }

  createElement (state, emit) {
    var { trackOrder } = state.library
    var { artwork, currentIndex } = state.player

    this._emit = emit
    this._key = trackOrder[currentIndex]

    return html`
      <div class="${styles.player}">
        ${this._artwork.render(artwork)}
        ${this._controls.render(state, emit)}
        ${this._progress.render(state, emit)}
        ${this._volume.render(state, emit)}
      </div>
    `
  }

  update (state, emit) {
    this._emit = emit

    var { artwork, currentIndex } = state.player
    var { trackOrder } = state.library

    if (this._key !== trackOrder[currentIndex]) return true

    this._artwork.render(artwork)
    this._controls.render(state, emit)
    this._progress.render(state, emit)
    this._volume.render(state, emit)

    return false
  }
}

module.exports = Player
