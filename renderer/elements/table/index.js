var html = require('choo/html')
var fd = require('format-duration')
var styles = require('./styles')
var classNames = require('classnames')
var Component = require('cache-component')

function TableRows (opts) {
  if (!(this instanceof Table)) return new TableRows()
  if (!opts) opts = {}
  this._opts = Object.assign({}, opts)

  this._emit = null
  this._playScope = []
  this._currentIndex = null
  this._selectedIndex = null

  Component.call(this)
}

TableRows.prototype = Object.create(Component.prototype)

TableRows.prototype._selectTrack = function (meta, ev) {
  this._emit('player:select', meta)
}

TableRows.prototype._playTrack = function (meta, ev) {
  this._emit('player:updatePlaylist')
  this._emit('player:queue', meta)
  this._emit('player:play')
}

TableRows.prototype._rowMap = function (meta, idx) {
  var classes = {}
  classes[styles.playing] = this._currentIndex
  classes[styles.selected] = this._selectedIndex

  return html`
    <tr id="${meta.filepath}"
        onclick=${this._selectTrack.bind(null, meta)}
        ondblclick=${this._playTrack.bind(null, meta)}
        className="${classNames(classes)}">
      <td>${meta.title}</td>
      <td class="${styles.time}">${meta.duration ? fd(meta.duration * 1000) : ''}</td>
      <td>${meta.artist}</td>
      <td>${meta.album}</td>
    </tr>
  `
}

TableRows.prototype._render = function (state, emit) {
  this._emit = emit
  this._playScope = state.library.playScope
  this._currentIndex = state.player.current.index
  this._selectedIndex = state.player.selected.index

  return this._playScope.map(this._rowMap)
}

TableRows.prototype._update = function () {
  // this._emit = emit
  return true
}

function Table (opts) {
  if (!(this instanceof Table)) return new Table()
  if (!opts) opts = {}
  this._opts = Object.assign({}, opts)

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
        <table class="${styles.mediaList} ${styles.tableBody}">
          <tbody>${this._tableRows.render(state, emit)}</tbody>
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
