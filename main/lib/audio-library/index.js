var Nanobus = require('nanobus')

class AudioLibrary extends Nanobus {
  construtor (trackDict, state) {
    super('AudioLibrary')
    state = Object.assign({
      order: [],
      shuffle: null,
      index: 0,
      searchTerm: null
    }, state)

    this.trackDict = trackDict || {} // All your tracks keyed by filename
    this.order = state.order.length ? state.order : Object.keys(trackDict)
    this.shuffle = state.shuffle
    this.index = state.index
    this.searchTerm = state.search

    this.isNewQuery = false

    this.newSearchTerm = null
    this.newOrder = null

    this._sortList = this._sortList.bind(this)
  }

  get currentKey () {
    return this.order[this.index]
  }

  get currentTrack () {
    return this.trackDict[this.currentKey]
  }

  get visibleOrder () {
    if (this.isNewQuery) return this.newOrder
    else return this.order
  }

  get shuffling () {
    return !!this.shuffle
  }

  set shuffling (bool) {
    this.shuffling = bool
  }

  queue (index) {
    var err
    if (this.isNewQuery) {
      if (index > this.newOrder.length - 1) {
        err = new Error('AudioLibrary: index not in range of current view')
        this.emit('error', err)
        throw err
      }

      this.index = index
      this.order = this.newOrder.slice()
      this.searchTerm = this.newSearchTerm

      this.recall()
    } else {
      if (index > this.order.length - 1) {
        err = new Error('AudioLibrary: index not in range of current view')
        this.emit('error', err)
        throw err
      }
      this.index = index
    }

    this.emit('new-track', this.currentTrack)
    return this.currentTrack
  }

  next () { // set and return the next track 🔁
    if (this.order.length > 0) {
      var newIndex = this.index < this.order.length - 1 ? this.index + 1 : 0
      this.index = newIndex
      this.emit('new-track', this.currentTrack)
      return this.currentTrack
    } else {
      var err = new Error('AudioLibrary: Can\'t go forward, empty order array')
      this.emit('error', err)
      throw err // Maybe dont throw? Return? Noop?
    }
  }

  prev () { // set and return the prev track 🔁
    if (this.order.length > 0) {
      var newIndex = this.index > 0 ? this.index - 1 : this.order.length - 1
      this.index = newIndex
      this.emit('new-track', this.currentTrack)
      return this.currentTrack
    } else {
      var err = this.emit('error', new Error('AudioLibrary: Can\'t go back, empty order array'))
      this.emit('error', err)
      throw err
    }
  }

  _filterList (term, key) {
    var { title, album, artist } = this.trackDict[key]
    var artistStr = Array.isArray(artist) ? artist.join(', ') : artist
    var trackStr = (title + album + artistStr).toLowerCase().replace(/\s+/g, '')

    return trackStr.includes(term.toLowerCase().replace(/\s+/g, ''))
  }

  _sortList (keyA, keyB) { // Bound
    var aObj = this.trackDict[keyA]
    var bObj = this.trackDict[keyB]
      // sort by albumartist
      // if (aObj.albumartist[0] < bObj.albumartist[0]) return -1
      // if (aObj.albumartist[0] > bObj.albumartist[0]) return 1

      // sort by artist
    if (aObj.artist[0] < bObj.artist[0]) return -1
    if (aObj.artist[0] > bObj.artist[0]) return 1

      // then by album
    if (aObj.album < bObj.album) return -1
    if (aObj.album > bObj.album) return 1

      // then by disc no
    if (aObj.disk.no < bObj.disk.no) return -1
    if (aObj.disk.no > bObj.disk.no) return 1

      // then by disc no
    if (aObj.track.no < bObj.track.no) return -1
    if (aObj.track.no > bObj.track.no) return 1

      // then by title
    if (aObj.title < bObj.title) return -1
    if (aObj.title > bObj.title) return 1

      // then by filepath
    if (aObj.filepath < bObj.filepath) return -1
    if (aObj.filepath > bObj.filepath) return 1
    return 0
  }

  _search (term) {
    return Object.keys(this.trackDict)
                         .filter(this._filterList.bind(this, term))
                         .sort(this._sortList)
  }

  search (term) {
    this.isNewQuery = true
    this.newSearchTerm = term
    this.newOrder = this._search(term)
    this.emit('search', this.newOrder)
    return this.newOrder
  }

  reacall () {
    this.isNewQuery = false

    this.newOrder = null
    this.newSearchTerm = null
    this.newSort = null
  }
}

module.exports = AudioLibrary
