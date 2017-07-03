var html = require('choo/html')
var Component = require('cache-component')
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

Playlist.prototype._render = function (state, emit) {
  this._loading = state.library.loading

  if (this._loading) return loader()

  return html`
    <section class="${styles.pane}">
      <div class=${styles.tableHeader}>
        <table class="${styles.mediaList}">
          <thead>
            <tr>
              <th>Title</th>
              <th class="${styles.time}">Time</th>
              <th class="${styles.disk}">Disk</th>
              <th class="${styles.track}">Track</th>
              <th>Artist</th>
              <th>Album</th>
              <th class="${styles.year}">Year</th>
            </tr>
          </thead>
        </table>
      </div>
      ${this._tableRows.render(state, emit)}
    </section>
  `
}

Playlist.prototype._update = function (state, emit) {
  if (this._loading !== state.library.loading) return true
  if (this._tableRows._update(state, emit)) return true
  return false
}

module.exports = Playlist
