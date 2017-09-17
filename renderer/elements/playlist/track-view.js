var html = require('choo/html')
var fd = require('format-duration')
var cn = require('classnames')
var Component = require('nanocomponent')
var document = require('global/document')
var { formatCount } = require('./lib')
var { COLUMNS } = require('../../lib/constants')
var styles = require('./styles')
const { Menu, MenuItem, getCurrentWindow } = require('electron').remote

var OFFSET_BUFFER = 50

class TrackView extends Component {
  constructor (opts) {
    if (!opts) opts = {}
    super(opts)
    this._opts = Object.assign({}, opts)

    // State
    this._emit = null
    this._trackOrder = []
    this._trackDict = {}
    this._currentIndex = null
    this._selectedIndex = null
    this._sliceLength = 200
    this._sliceStartIndex = 0
    this._rowHeight = 39
    this._scrollWindowHeight = 1024
    this._ticking = false // https://developer.mozilla.org/en-US/docs/Web/Events/scroll#Example
    this._columns = {}

    // Bound methods
    // NOTE: not sure most of these are needed
    this._selectTrack = this._selectTrack.bind(this)
    this._deselect = this._deselect.bind(this)
    this._playTrack = this._playTrack.bind(this)
    this._rowMap = this._rowMap.bind(this)
    this._renderSlice = this._renderSlice.bind(this)
    this._mutateCurrentIndex = this._mutateCurrentIndex.bind(this)
    this._mutateSelectedIndex = this._mutateSelectedIndex.bind(this)
    this._handleOnScroll = this._handleOnScroll.bind(this)
    this._metaMenu = this._metaMenu.bind(this)
  }

  get _topVisibleRowIndex () {
    if (!this.element) throw new Error('Element not mounted')
    return Math.floor(this.element.scrollTop / this._rowHeight)
  }

  get _bottomVisibleRowIndex () {
    if (!this.element) throw new Error('Element not mounted')
    var {clientHeight} = this.element
    return Math.floor(clientHeight / this._rowHeight) + this._topVisibleRowIndex
  }

  get _topOffset () {
    return this._topVisibleRowIndex - this._sliceStartIndex
  }

  get _bottomOffset () {
    var lastRenderedIndex = this._sliceStartIndex + this._sliceLength
    return lastRenderedIndex - this._bottomVisibleRowIndex
  }

  _selectTrack (ev) {
    var t = ev.target
    while (t && !t.id) t = t.parentNode // Bubble up
    if (t && t.tagName === 'TR') {
      ev.stopPropagation()
      var index = Number(t.id.replace('track-', ''))
      this._emit('library:select', index)
    }
  }

  _playTrack (ev) {
    var t = ev.target
    while (t && !t.id) t = t.parentNode // Bubble up
    if (t && t.tagName === 'TR') {
      var index = Number(t.id.replace('track-', ''))
      this._emit('player:queue', index)
      this._emit('player:play')
    }
  }

  _mutateCurrentIndex (newIndex) {
    var oldIndex = this._currentIndex
    var oldEl = document.getElementById(`track-${oldIndex}`)
    var newEl = document.getElementById(`track-${newIndex}`)

    if (oldEl) oldEl.classList.toggle(styles.playing, false)
    if (newEl) newEl.classList.toggle(styles.playing, true)

    this._currentIndex = newIndex
  }

  _mutateSelectedIndex (newIndex) {
    var oldIndex = this._selectedIndex
    var oldEl = document.getElementById(`track-${oldIndex}`)
    var newEl = document.getElementById(`track-${newIndex}`)

    if (oldEl) oldEl.classList.toggle(styles.selected, false)
    if (newEl) newEl.classList.toggle(styles.selected, true)

    if (this._selectedIndex != null) {
      let selected = document.querySelector(styles.selected.selector)
      if (selected != null) selected.scrollIntoViewIfNeeded(false)
    }

    this._selectedIndex = newIndex
  }

  // TODO: figure out Y offset for top element when scrolling up
  _rowMap (key, idx) {
    // Look up track info
    var track = this._trackDict[key]
    var columns = Object.keys(this._columns).filter(col => this._columns[col])

    // create meta display values
    var meta = Object.assign({}, track, {
      duration: track.duration ? fd(track.duration * 1000) : '',
      track: track.track ? formatCount(track.track) : '',
      disk: track.disk ? formatCount(track.disk) : ''
    })

    // Generate state based styles
    var classes = cn({
      [styles.playing]: this._currentIndex === idx + this._sliceStartIndex,
      [styles.selected]: this._selectedIndex === idx + this._sliceStartIndex
    })

    return html`
      <tr id="track-${idx + this._sliceStartIndex}" data-key=${key} class=${classes}>
        ${columns.map(col => html`
          <th class=${styles[col]}>${meta[col]}</th>
        `)}
      </tr>
    `
  }

  _metaMenu (event) {
    event.preventDefault()

    const menu = new Menu()

    Array.from(COLUMNS).map(col => ({
      label: capitalize(col),
      type: 'checkbox',
      checked: this._columns[col],
      click: () => this._emit('library:columns', col)
    })).forEach(item => menu.append(new MenuItem(item)))

    menu.popup(getCurrentWindow())
  }

  _renderSlice () {
    var sliceOffset = `top: ${this._sliceStartIndex * this._rowHeight}px;`
    var tableContainerHeight = `height: ${this._trackOrder.length * this._rowHeight}px;`
    var sliceEnd = this._sliceStartIndex + this._sliceLength < this._trackOrder.length
      ? this._sliceStartIndex + this._sliceLength
      : this._trackOrder.length
    var tracks = this._trackOrder.slice(this._sliceStartIndex, sliceEnd).map(this._rowMap)
    var columns = Object.keys(this._columns).filter(col => this._columns[col])

    return html`
      <div class=${styles.tableScrollWindow} onscroll=${this._handleOnScroll} onclick=${this._deselect}>
        <div class=${styles.tableContainer} style=${tableContainerHeight}>
          <table style=${sliceOffset} class=${styles.mediaList}>
            <thead oncontextmenu=${this._metaMenu} class=${styles.stickyHead}>
              <tr>
                ${columns.map(col => html`
                  <th class=${styles[col]}>${capitalize(col)}</th>
                `)}
              </tr>
            </thead>
            <tbody ondblclick=${this._playTrack} onclick=${this._selectTrack}>
              ${tracks}
            </tbody>
          </table>
        </div>
      </div>
    `
  }

  _deselect () {
    this._emit('library:select', null)
  }

  _handleOnScroll (ev) {
    var self = this
    var maxStart = this._trackOrder.length - this._sliceLength
    var closeToBottom = this._bottomOffset < OFFSET_BUFFER && this._sliceStartIndex !== maxStart
    var closeToTop = this._topOffset < OFFSET_BUFFER && this._sliceStartIndex !== 0

    if (closeToBottom) {
      var frontSlice = this._topVisibleRowIndex - OFFSET_BUFFER
      this._sliceStartIndex = frontSlice > maxStart ? maxStart : frontSlice
    }

    if (closeToTop) {
      var backSlice = this._bottomVisibleRowIndex + OFFSET_BUFFER - this._sliceLength
      this._sliceStartIndex = backSlice > 0 ? backSlice : 0
    }

    if (!this._ticking && (closeToTop || closeToBottom)) {
      window.requestAnimationFrame(function () {
        self.render(null, null, true)
        self._ticking = false
      })
      this._ticking = true
    }
  }

  createElement (state, emit) {
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
      // set of currently displayed columns
      this._columns = Object.assign({}, state.library.columns) // must be cloned for comparison
    }

    return this._renderSlice()
  }

  update (state, emit, scroll) {
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
    if (shouldColumnsUpdate(this._columns, state.library.columns)) return true
    // Cache!
    return false
  }

  beforerender (el) {
    var self = this
    window.requestAnimationFrame(function () {
      el.scrollTop = self._sliceStartIndex * self._rowHeight
    })
  }
}

function shouldColumnsUpdate (cols, newCols) {
  return Object.keys(cols).filter(k => cols[k] !== newCols[k]).length !== 0
}

function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

module.exports = TrackView
