var html = require('choo/html')
var Component = require('nanocomponent')
var styles = require('./styles')
var TableRows = require('./rows')
var loader = require('../loader')

function Playlist (opts) {
  if (!(this instanceof Playlist)) return new Playlist(opts)
  if (!opts) opts = {}
  this._opts = Object.assign({}, opts)

  // Owned Children
  this._tableRows = new TableRows()

  Component.call(this)
}

Playlist.prototype = Object.create(Component.prototype)

Playlist.prototype.createElement = function (state, emit) {
  this._loading = state.library.loading

  if (this._loading) return loader()

  return html`
    <section class="${styles.pane}">
      ${this._tableRows.render(state, emit)}
    </section>
  `
}

Playlist.prototype.update = function (state, emit) {
  if (this._loading !== state.library.loading) return true
  if (this._tableRows.update(state, emit)) return true
  return false
}

module.exports = Playlist
