var html = require('choo/html')
var Component = require('cache-component')
var styles = require('./styles')
var TableRows = require('./rows')

function Table (opts) {
  if (!(this instanceof Table)) return new Table()
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
              <th>Artist</th>
              <th>Album</th>
            </tr>
          </thead>
        </table>
      </div>
      <div class=${styles.tableBody}>
        <table class="${styles.mediaList}">
          ${this._tableRows.render(state, emit)}
        </table>
      </div>
    </section>
  `
}

Table.prototype._update = function (state, emit) {
  if (this._tableRows._update(state, emit)) return true
  return false
}

module.exports = Table
