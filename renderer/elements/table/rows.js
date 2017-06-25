var html = require('choo/html')
var fd = require('format-duration')
var classNames = require('classnames')
var Component = require('cache-component')
var document = require('global/document')
var {formatCount} = require('./lib')
var styles = require('./styles')
// var debounce = require('lodash.debounce')

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
  this._sliceLength = 500
  this._sliceStartIndex = 0
  this._rowHeight = 24
  this._scrollWindowHeight = 1024

  var self = this

  Object.defineProperty(this, '_topVisibleRowIndex', {
    get: function () {
      if (!self._element) throw new Error('Element not mounted')
      return Math.floor(self._element.scrollTop / self._rowHeight)
    }
  })

  Object.defineProperty(this, '_bottomVisibleRowIndex', {
    get: function () {
      if (!self._element) throw new Error('Element not mounted')
      var {clientHeight} = self._element
      return Math.floor(clientHeight / self._rowHeight) + self._topVisibleRowIndex
    }
  })

  Object.defineProperty(this, '_topOffset', {
    get: function () {
      return self._topVisibleRowIndex - self._sliceStartIndex
    }
  })

  Object.defineProperty(this, '_bottomOffset', {
    get: function () {
      var lastRenderedIndex = self._sliceStartIndex + self._sliceLength
      return lastRenderedIndex - self._bottomVisibleRowIndex
    }
  })

  // Bound methods
  this._selectTrack = this._selectTrack.bind(this)
  this._playTrack = this._playTrack.bind(this)
  this._rowMap = this._rowMap.bind(this)
  this._renderSlice = this._renderSlice.bind(this)
  this._mutateCurrentIndex = this._mutateCurrentIndex.bind(this)
  this._mutateSelectedIndex = this._mutateSelectedIndex.bind(this)
  this._handleOnScroll = this._handleOnScroll.bind(this)

  Component.call(this)
}
TableRows.prototype = Object.create(Component.prototype)

TableRows.prototype._selectTrack = function (ev) {
  var t = ev.target
  while (t && !t.id) t = t.parentNode // Bubble up
  if (t && t.tagName === 'TR') {
    var index = Number(t.id.replace('track-', ''))
    this._emit('library:select', index)
  }
}

TableRows.prototype._playTrack = function (ev) {
  var t = ev.target
  while (t && !t.id) t = t.parentNode // Bubble up
  if (t && t.tagName === 'TR') {
    var index = Number(t.id.replace('track-', ''))
    this._emit('player:queue', index)
    this._emit('player:play')
  }
}

TableRows.prototype._mutateCurrentIndex = function (newIndex) {
  var oldIndex = this._currentIndex
  var oldEl = document.getElementById(`track-${oldIndex}`)
  var newEl = document.getElementById(`track-${newIndex}`)

  if (oldEl) oldEl.classList.toggle(styles.playing, false)
  if (newEl) newEl.classList.toggle(styles.playing, true)

  this._currentIndex = newIndex
}

TableRows.prototype._mutateSelectedIndex = function (newIndex) {
  var oldIndex = this._selectedKey
  var oldEl = document.getElementById(`track-${oldIndex}`)
  var newEl = document.getElementById(`track-${newIndex}`)

  if (oldEl) oldEl.classList.toggle(styles.selected, false)
  if (newEl) newEl.classList.toggle(styles.selected, true)

  this._selectedKey = newIndex
}

TableRows.prototype._rowMap = function (key, idx) {
  // Look up track info
  var meta = this._trackDict[key]
  // Generate state based styles
  var classes = {}
  classes[styles.playing] = this._currentIndex === idx + this._sliceStartIndex
  classes[styles.selected] = this._selectedIndex === idx + this._sliceStartIndex

  return html`
    <tr style=""
        id="track-${idx + this._sliceStartIndex}"
        data-key=${key}
        className="${classNames(classes)}">
      <td>${meta.title}</td>
      <td class="${styles.time}">${meta.duration ? fd(meta.duration * 1000) : ''}</td>
      <td class="${styles.disk}">${meta.disk ? formatCount(meta.disk) : ''}</td>
      <td class="${styles.track}">${meta.track ? formatCount(meta.track) : ''}</td>
      <td>${meta.artist}</td>
      <td>${meta.album}</td>
      <td class="${styles.year}">${meta.year}</td>
    </tr>
  `
}

TableRows.prototype._renderSlice = function () {
  var sliceOffset = this._sliceStartIndex * this._rowHeight
  var sliceEnd = this._sliceStartIndex + this._sliceLength < this._trackOrder.length ? this._sliceStartIndex + this._sliceLength : this._trackOrder.length - 1

  return html`
    <div class=${styles.tableScrollWindow}
         onscroll=${this._handleOnScroll}>
      <div class='${styles.tableContainer}'
           style="height: ${this._trackOrder.length * this._rowHeight}px;">
        <table style="top: ${sliceOffset}px;" class="${styles.mediaList} ${styles.tableRel}">
          <tbody ondblclick=${this._playTrack}
                 onclick=${this._selectTrack}>
            ${this._trackOrder.slice(this._sliceStartIndex, sliceEnd).map(this._rowMap)}
          </tbody>
        </table>
      </div>
    </div>`
}

TableRows.prototype._handleOnScroll = function (ev) {
  var maxStart = (this._trackOrder.length - this._sliceLength)
  var closeToBottom = this._bottomOffset < 20 && this._sliceStartIndex !== maxStart
  var closeToTop = this._topOffset < 20 && this._sliceStartIndex !== 0
  if (closeToBottom) {
    var frontSlice = this._topVisibleRowIndex - 20
    this._sliceStartIndex = frontSlice > maxStart ? maxStart : frontSlice
  }

  if (closeToTop) {
    var backSlice = this._bottomVisibleRowIndex + 20 - this._sliceLength
    this._sliceStartIndex = backSlice > 0 ? backSlice : 0
  }

  if (closeToTop || closeToBottom) return this.render(null, null, true)
}

TableRows.prototype._render = function (state, emit) {
  if (emit) this._emit = emit
  if (state) {
    // Save references to state track order and dicts
    this._trackOrder = state.library.trackOrder
    this._trackDict = state.library.trackDict
    // Save state
    // Current index is the index of a queued track
    this._currentIndex = state.player.currentIndex
    // Selected index is the index of the highlighted track
    this._selectedIndex = state.library.selectedIndex
  }
  return this._renderSlice()
}

TableRows.prototype._update = function (state, emit, scroll) {
  // Re-render
  // Note, these are only shallow compares.  You must slice or reobject your state
  if (scroll) return true
  if (this._trackOrder !== state.library.trackOrder) return true
  if (this._trackDict !== state.library.trackDict) return true
  // Mutate
  if (this._currentIndex !== state.player.currentIndex) {
    this._mutateCurrentIndex(state.player.currentIndex)
  }
  if (this._selectedIndex !== state.library.selectedIndex) {
    this._mutateSelectedIndex(state.library.selectedIndex)
  }
  // Cache!
  return false
}

module.exports = TableRows
