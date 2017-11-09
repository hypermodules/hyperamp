var html = require('choo/html')
var Component = require('nanocomponent')
var Header = require('../../elements/header')
var styles = require('./styles')
var TrackView = require('./track-view')
var loader = require('../loader')

class Playlist extends Component {
  constructor (opts) {
    if (!opts) opts = {}
    super(opts)
    this.opts = Object.assign({}, opts)

    // Owned Children
    this.header = new Header()
    this.trackView = new TrackView()
  }

  createElement (state, emit) {
    this.loading = state.library.loading

    return html`
      <div class="${styles.playlist}">
        ${this.header.render(state, emit)}
        ${this.loading
          ? loader()
          : this.trackView.render(state, emit)}
      </div>
    `
  }

  update (state, emit) {
    if (this.loading !== state.library.loading) return true
    this.trackView.render(state, emit)
    return false
  }
}

module.exports = Playlist
