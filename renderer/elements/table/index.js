var html = require('choo/html')
var Component = require('cache-component')
var styles = require('./styles')
var TableRows = require('./rows')

function Table (opts) {
  if (!(this instanceof Table)) return new Table(opts)
  if (!opts) opts = {}
  this._opts = Object.assign({}, opts)

  // Owned Children
  this._tableRows = new TableRows()

  Component.call(this)
}

Table.prototype = Object.create(Component.prototype)

Table.prototype._render = function (state, emit) {
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

Table.prototype._update = function (state, emit) {
  if (this._tableRows._update(state, emit)) return true
  return false
}

module.exports = Table
