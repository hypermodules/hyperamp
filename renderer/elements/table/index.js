var html = require('choo/html')
var fd = require('format-duration')
var classNames = require('classnames')
var Component = require('cache-component')
// var document = require('global/document')
var styles = require('./styles')

function TableRows (opts) {
  if (!(this instanceof Table)) return new TableRows()
  if (!opts) opts = {}
  this._opts = Object.assign({}, opts)

  // State
  this._emit = null
  this._trackOrder = []
  this._trackDict = {}
  this._currentIndex = null
  this._selectedIndex = null

  // Bound methods
  this._selectTrack = this._selectTrack.bind(this)
  this._playTrack = this._playTrack.bind(this)
  this._rowMap = this._rowMap.bind(this)

  Component.call(this)
}
TableRows.prototype = Object.create(Component.prototype)

TableRows.prototype._selectTrack = function (ev) {
  var key = ev.target.id
  // TODO snag the index rather than they most likely
  this._emit('player:select', key)
}

TableRows.prototype._playTrack = function (ev) {
  var key = ev.target.id
  // TODO snag the index rather than they most likely
  this._emit('player:queue', key)
  this._emit('player:play')
}

TableRows.prototype._rowMap = function (key, idx) {
  // Look up track info
  var meta = this._trackDict[key]
  // Generate state based styles
  var classes = {}
  classes[styles.playing] = this._currentIndex === idx
  classes[styles.selected] = this._selectedIndex === idx

  return html`
    <tr id="${key}"
        data-index=${idx}
        onclick=${this._selectTrack}
        ondblclick=${this._playTrack}
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
  // Save references to state track order and dicts
  this._trackOrder = state.library.trackOrder
  this._trackDict = state.library.trackDict
  // Save state
  // Current index is the index of a queued track
  this._currentIndex = state.player.current.index
  // Selected index is the index of the highlighted track
  this._selectedIndex = state.player.selected.index

  return this._playScope.map(this._rowMap)
}

TableRows.prototype._update = function (state, emit) {
  if (this._trackOrder !== state.library.trackOrder) return true
  if (this._trackDict !== state.library.trackDict) return true
  // TODO: we can mutate these
  if (this._currentIndex !== state.player.current.index) return true
  if (this._selectedIndex !== state.player.selected.index) return true
  return false
}

// We keep these separated because we may want to update these components
// separately in the future.

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
