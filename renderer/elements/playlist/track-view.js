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
    this.opts = Object.assign({}, opts)

    // State
    this.emit = null
    this.trackOrder = []
    this.trackDict = {}
    this.currentIndex = null
    this.selectedIndex = null
    this.sliceLength = 200
    this.sliceStartIndex = 0
    this.rowHeight = 39
    this.scrollWindowHeight = 1024
    this.ticking = false // https://developer.mozilla.org/en-US/docs/Web/Events/scroll#Example
    this.columns = {}

    // Bound methods
    // NOTE: not sure most of these are needed
    this.selectTrack = this.selectTrack.bind(this)
    this.deselect = this.deselect.bind(this)
    this.playTrack = this.playTrack.bind(this)
    this.rowMap = this.rowMap.bind(this)
    this.renderSlice = this.renderSlice.bind(this)
    this.mutateCurrentIndex = this.mutateCurrentIndex.bind(this)
    this.mutateSelectedIndex = this.mutateSelectedIndex.bind(this)
    this.handleOnScroll = this.handleOnScroll.bind(this)
    this.metaMenu = this.metaMenu.bind(this)
  }

  get topVisibleRowIndex () {
    if (!this.element) throw new Error('Element not mounted')
    return Math.floor(this.element.scrollTop / this.rowHeight)
  }

  get bottomVisibleRowIndex () {
    if (!this.element) throw new Error('Element not mounted')
    var {clientHeight} = this.element
    return Math.floor(clientHeight / this.rowHeight) + this.topVisibleRowIndex
  }

  get topOffset () {
    return this.topVisibleRowIndex - this.sliceStartIndex
  }

  get bottomOffset () {
    var lastRenderedIndex = this.sliceStartIndex + this.sliceLength
    return lastRenderedIndex - this.bottomVisibleRowIndex
  }

  selectTrack (ev) {
    var t = ev.target
    while (t && !t.id) t = t.parentNode // Bubble up
    if (t && t.tagName === 'TR') {
      ev.stopPropagation()
      var index = Number(t.id.replace('track-', ''))
      this.emit('library:select', index)
    }
  }

  playTrack (ev) {
    var t = ev.target
    while (t && !t.id) t = t.parentNode // Bubble up
    if (t && t.tagName === 'TR') {
      var index = Number(t.id.replace('track-', ''))
      this.emit('player:queue', index)
      this.emit('player:play')
    }
  }

  mutateCurrentIndex (newIndex) {
    var oldIndex = this.currentIndex
    var oldEl = document.getElementById(`track-${oldIndex}`)
    var newEl = document.getElementById(`track-${newIndex}`)

    if (oldEl) oldEl.classList.toggle(styles.playing, false)
    if (newEl) newEl.classList.toggle(styles.playing, true)

    this.currentIndex = newIndex
  }

  mutateSelectedIndex (newIndex) {
    var oldIndex = this.selectedIndex
    var oldEl = document.getElementById(`track-${oldIndex}`)
    var newEl = document.getElementById(`track-${newIndex}`)

    if (oldEl) oldEl.classList.toggle(styles.selected, false)
    if (newEl) newEl.classList.toggle(styles.selected, true)

    if (this.selectedIndex != null) {
      let selected = document.querySelector(styles.selected.selector)
      if (selected != null) selected.scrollIntoViewIfNeeded(false)
    }

    this.selectedIndex = newIndex
  }

  // TODO: figure out Y offset for top element when scrolling up
  rowMap (key, idx) {
    // Look up track info
    var track = this.trackDict[key]
    var columns = Object.keys(this.columns).filter(col => this.columns[col])

    // create meta display values
    var meta = Object.assign({}, track, {
      time: track.duration ? fd(track.duration * 1000) : '',
      track: track.track ? formatCount(track.track) : '',
      disk: track.disk ? formatCount(track.disk) : ''
    })

    // Generate state based styles
    var classes = cn({
      [styles.playing]: this.currentIndex === idx + this.sliceStartIndex,
      [styles.selected]: this.selectedIndex === idx + this.sliceStartIndex
    })

    return html`
      <tr id="track-${idx + this.sliceStartIndex}" data-key=${key} class=${classes}>
        ${columns.map(col => html`
          <td class=${styles[col]}>${meta[col]}</td>
        `)}
      </tr>
    `
  }

  metaMenu (event) {
    event.preventDefault()

    const menu = new Menu()

    Array.from(COLUMNS).map(col => ({
      label: capitalize(col),
      type: 'checkbox',
      checked: this.columns[col],
      click: () => this.emit('library:columns', col)
    })).forEach(item => menu.append(new MenuItem(item)))

    menu.popup(getCurrentWindow())
  }

  renderSlice () {
    var sliceOffset = `top: ${this.sliceStartIndex * this.rowHeight}px;`
    var tableContainerHeight = `height: ${this.trackOrder.length * this.rowHeight}px;`
    var sliceEnd = this.sliceStartIndex + this.sliceLength < this.trackOrder.length
      ? this.sliceStartIndex + this.sliceLength
      : this.trackOrder.length
    var tracks = this.trackOrder.slice(this.sliceStartIndex, sliceEnd).map(this.rowMap)
    var columns = Object.keys(this.columns).filter(col => this.columns[col])

    return html`
      <div class=${styles.tableScrollWindow} onscroll=${this.handleOnScroll} onclick=${this.deselect}>
        <div class=${styles.tableContainer} style=${tableContainerHeight}>
          <table style=${sliceOffset} class=${styles.mediaList}>
            <thead oncontextmenu=${this.metaMenu} class=${styles.stickyHead}>
              <tr>
                ${columns.map(col => html`
                  <th class=${styles[col]}>${capitalize(col)}</th>
                `)}
              </tr>
            </thead>
            <tbody ondblclick=${this.playTrack} onclick=${this.selectTrack}>
              ${tracks}
            </tbody>
          </table>
        </div>
      </div>
    `
  }

  deselect () {
    this.emit('library:select', null)
  }

  handleOnScroll (ev) {
    var self = this
    var maxStart = this.trackOrder.length - this.sliceLength
    var closeToBottom = this.bottomOffset < OFFSET_BUFFER && this.sliceStartIndex !== maxStart
    var closeToTop = this.topOffset < OFFSET_BUFFER && this.sliceStartIndex !== 0

    if (closeToBottom) {
      var frontSlice = this.topVisibleRowIndex - OFFSET_BUFFER
      this.sliceStartIndex = frontSlice > maxStart ? maxStart : frontSlice
    }

    if (closeToTop) {
      var backSlice = this.bottomVisibleRowIndex + OFFSET_BUFFER - this.sliceLength
      this.sliceStartIndex = backSlice > 0 ? backSlice : 0
    }

    if (!this.ticking && (closeToTop || closeToBottom)) {
      window.requestAnimationFrame(function () {
        self.render(null, null, true)
        self.ticking = false
      })
      this.ticking = true
    }
  }

  createElement (state, emit) {
    if (emit) this.emit = emit
    if (state) {
      // Save references to state track order and dicts
      this.trackOrder = state.library.trackOrder
      this.trackDict = state.library.trackDict
      // Save state
      // Current index is the index of a queued track
      this.currentIndex = state.player.currentIndex
      // Selected index is the index of the highlighted track
      this.selectedIndex = state.library.selectedIndex
      // set of currently displayed columns
      this.columns = Object.assign({}, state.library.columns) // must be cloned for comparison
    }

    return this.renderSlice()
  }

  update (state, emit, scroll) {
    // Re-render
    // Note, these are only shallow compares.  You must slice or reobject your state
    if (scroll) return true
    if (this.trackOrder !== state.library.trackOrder) return true
    if (this.trackDict !== state.library.trackDict) return true
    // Mutate
    if (this.currentIndex !== state.player.currentIndex) {
      this.mutateCurrentIndex(state.player.currentIndex)
    }
    if (this.selectedIndex !== state.library.selectedIndex) {
      this.mutateSelectedIndex(state.library.selectedIndex)
    }
    if (shouldColumnsUpdate(this.columns, state.library.columns)) return true
    // Cache!
    return false
  }

  beforerender (el) {
    var self = this
    window.requestAnimationFrame(function () {
      el.scrollTop = self.sliceStartIndex * self.rowHeight
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
