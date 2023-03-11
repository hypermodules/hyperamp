const html = require('choo/html')
const fd = require('format-duration')
const cn = require('classnames')
const Component = require('nanocomponent')
const document = require('global/document')
const { formatCount } = require('./lib')
const { COLUMNS } = require('../../lib/constants')
const styles = require('./styles')
const remote = require('@electron/remote')
const { Menu, MenuItem, getCurrentWindow, shell } = remote

const OFFSET_BUFFER = 50

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
    this.scrollTo = this.scrollTo.bind(this)
    this.scrollCurrent = this.scrollCurrent.bind(this)
  }

  get topVisibleRowIndex () {
    return Math.floor(this.element.scrollTop / this.rowHeight)
  }

  get bottomVisibleRowIndex () {
    const { clientHeight } = this.element
    return Math.floor(clientHeight / this.rowHeight) + this.topVisibleRowIndex
  }

  get midIndexOffset () {
    return Math.floor((this.bottomVisibleRowIndex - this.topVisibleRowIndex - 1) / 2)
  }

  get topOffset () {
    return this.topVisibleRowIndex - this.sliceStartIndex
  }

  get bottomOffset () {
    const lastRenderedIndex = this.sliceStartIndex + this.sliceLength
    return lastRenderedIndex - this.bottomVisibleRowIndex
  }

  get maxScrollTop () {
    return this.element.scrollHeight - this.element.clientHeight
  }

  scrollTo (index) {
    window.requestAnimationFrame(() => {
      let middleScrollTop = ((index - this.midIndexOffset) * this.rowHeight)
      if (middleScrollTop < 0) middleScrollTop = 0
      if (middleScrollTop > this.maxScrollTop) middleScrollTop = this.maxScrollTop
      if (index < this.topVisibleRowIndex + 1 || index > this.bottomVisibleRowIndex - 1) {
        this.element.scrollTop = middleScrollTop
      }
    })
  }

  scrollCurrent () {
    this.scrollTo(this.currentIndex)
  }

  selectTrack (ev) {
    let t = ev.target
    while (t && !t.id) t = t.parentNode // Bubble up
    if (t && t.tagName === 'TR') {
      ev.stopPropagation()
      const index = Number(t.id.replace('track-', ''))
      this.emit('library:select', index)
    }
  }

  playTrack (ev) {
    let t = ev.target
    while (t && !t.id) t = t.parentNode // Bubble up
    if (t && t.tagName === 'TR') {
      const index = Number(t.id.replace('track-', ''))
      this.emit('library:queue', index)
      this.emit('player:play')
    }
  }

  mutateCurrentIndex (newIndex) {
    const oldIndex = this.currentIndex
    const oldEl = document.getElementById(`track-${oldIndex}`)
    const newEl = document.getElementById(`track-${newIndex}`)

    if (oldEl) oldEl.classList.toggle(styles.playing, false)
    if (newEl) newEl.classList.toggle(styles.playing, true)

    this.currentIndex = newIndex
  }

  mutateSelectedIndex (newIndex) {
    const oldIndex = this.selectedIndex
    const oldEl = document.getElementById(`track-${oldIndex}`)
    const newEl = document.getElementById(`track-${newIndex}`)

    if (oldEl) oldEl.classList.toggle(styles.selected, false)
    if (newEl) newEl.classList.toggle(styles.selected, true)

    if (this.selectedIndex != null) {
      const selected = document.querySelector(styles.selected.selector)
      if (selected != null) selected.scrollIntoViewIfNeeded(false)
    }

    this.selectedIndex = newIndex
  }

  // TODO: figure out Y offset for top element when scrolling up
  rowMap (key, idx) {
    // Look up track info
    const track = this.trackDict[key]
    const columns = Object.keys(this.columns).filter(col => this.columns[col])

    // create meta display values
    const meta = Object.assign({}, track, {
      time: track.duration ? fd(track.duration * 1000) : '',
      track: track.track ? formatCount(track.track) : '',
      disk: track.disk ? formatCount(track.disk) : ''
    })

    // Generate state based styles
    const classes = cn({
      [styles.playing]: this.currentIndex === idx + this.sliceStartIndex && !this.isNewQuery,
      [styles.selected]: this.selectedIndex === idx + this.sliceStartIndex
    })

    return html`
      <tr id="track-${idx + this.sliceStartIndex}"
        data-key=${key}
        class=${classes}
        oncontextmenu=${trackMenu(track.filepath)}>
        ${columns.map(col => html`
          <td class=${styles[col]}>${arrToStr(meta[col])}</td>
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
    const sliceOffset = `top: ${this.sliceStartIndex * this.rowHeight}px;`
    const tableContainerHeight = `height: ${this.trackOrder.length * this.rowHeight}px;`
    const sliceEnd = this.sliceStartIndex + this.sliceLength < this.trackOrder.length
      ? this.sliceStartIndex + this.sliceLength
      : this.trackOrder.length
    const tracks = this.trackOrder.slice(this.sliceStartIndex, sliceEnd).map(this.rowMap)
    const columns = Object.keys(this.columns).filter(col => this.columns[col])

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
    const self = this

    const maxStart = this.trackOrder.length - this.sliceLength > 0 ? this.trackOrder.length - this.sliceLength : 0
    const closeToBottom = this.bottomOffset < OFFSET_BUFFER && this.sliceStartIndex !== maxStart
    const closeToTop = this.topOffset < OFFSET_BUFFER && this.sliceStartIndex !== 0

    if (closeToBottom) {
      const frontSlice = this.topVisibleRowIndex - OFFSET_BUFFER
      this.sliceStartIndex = frontSlice > maxStart ? maxStart : frontSlice
    }

    if (closeToTop) {
      const backSlice = this.bottomVisibleRowIndex + OFFSET_BUFFER - this.sliceLength
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
      this.currentIndex = state.library.currentIndex
      this.isNewQuery = state.library.isNewQuery
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
    if (this.isNewQuery !== state.library.isNewQuery) return true
    if (shouldColumnsUpdate(this.columns, state.library.columns)) return true
    // Mutate
    if (this.currentIndex !== state.library.currentIndex && !this.isNewQuery) {
      this.mutateCurrentIndex(state.library.currentIndex)
    }
    if (this.selectedIndex !== state.library.selectedIndex) {
      this.mutateSelectedIndex(state.library.selectedIndex)
    }
    // Cache!
    return false
  }

  beforerender (el) {
    const self = this
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

function trackMenu (filepath) {
  return function onTrackContextMenu (event) {
    event.preventDefault()
    const menu = new Menu()
    menu.append(new MenuItem({
      // TODO: show appropriate labels for windows & linux
      label: 'Reveal in Finder',
      click: () => shell.showItemInFolder(filepath)
    }))
    menu.popup(getCurrentWindow())
  }
}

function arrToStr (arr) {
  if (Array.isArray(arr)) return arr.join(', ')
  return arr
}

module.exports = TrackView
