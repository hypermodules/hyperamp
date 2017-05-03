var html = require('choo/html')
var fd = require('format-duration')
var classNames = require('classnames')
var Component = require('cache-component')
var document = require('global/document')
var styles = require('./styles')

function TableRows (opts) {
  if (!(this instanceof TableRows)) return new TableRows()
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
  this._mutateCurrentIndex = this._mutateCurrentKey.bind(this)
  this._mutateSelectedIndex = this._mutateSelectedKey.bind(this)

  Component.call(this)
}
TableRows.prototype = Object.create(Component.prototype)

TableRows.prototype._selectTrack = function (ev) {
  var index = ev.target.dataset.index
  this._emit('player:select', index)
}

TableRows.prototype._playTrack = function (ev) {
  var index = ev.target.dataset.index
  this._emit('player:queue', index)
  this._emit('player:play')
}

TableRows.prototype._mutateCurrentIndex = function (newIndex) {
  var oldIndex = this._currentIndex

  document.getElementById(`track-${oldIndex}]`).classList.toggle(styles.playing, false)
  document.getElementById(`track-${newIndex}]`).classList.toggle(styles.playing, true)

  this._currentIndex = newIndex
}

TableRows.prototype._mutateSelectedKey = function (newIndex) {
  var oldIndex = this._selectedKey

  document.getElementById(`track-${oldIndex}]`).classList.toggle(styles.selected, false)
  document.getElementById(`track-${newIndex}]`).classList.toggle(styles.selected, true)

  this._selectedKey = newIndex
}

TableRows.prototype._rowMap = function (key, idx) {
  // Look up track info
  var meta = this._trackDict[key]
  // Generate state based styles
  var classes = {}
  classes[styles.playing] = this._currentIndex === idx
  classes[styles.selected] = this._selectedIndex === idx

  return html`
    <tr id="track-${idx}"
        data-key=${key}
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
  this._currentIndex = state.player.currentIndex
  // Selected index is the index of the highlighted track
  this._selectedIndex = state.player.selectedIndex

  return this._playScope.map(this._rowMap)
}

TableRows.prototype._update = function (state, emit) {
  // Re-render
  // Note, these are only shallow compares.  You must slice or reobject your state
  if (this._trackOrder !== state.library.trackOrder) return true
  if (this._trackDict !== state.library.trackDict) return true
  // Mutate
  if (this._currentIndex !== state.player.currentIndex) {
    this._mutateCurrentIndex(state.player.currentIndex)
  }
  if (this._selectedIndex !== state.player.selectedIndex) {
    this._mutateSelectedIndex(state.player.selectedIndex)
  }
  // Cache!
  return false
}
