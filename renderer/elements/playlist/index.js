var html = require('choo/html')
var Component = require('nanocomponent')
var Header = require('../../elements/header')
var styles = require('./styles')
var TrackView = require('./track-view')
var loader = require('../loader')

var header = new Header()

class Playlist extends Component {
  constructor (opts) {
    if (!opts) opts = {}
    super(opts)
    this._opts = Object.assign({}, opts)

    // Owned Children
    this._trackView = new TrackView()
  }

  createElement (state, emit) {
    this._loading = state.library.loading

    if (this._loading) return loader()

    return html`
      <div class="${styles.playlist}">
        ${header.render(state, emit)}
        ${this._trackView.render(state, emit)}
      </div>
    `
  }

  update (state, emit) {
    if (this._loading !== state.library.loading) return true
    if (this._trackView.update(state, emit)) return true
    return false
  }
}

module.exports = Playlist
