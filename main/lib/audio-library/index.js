const Nanobus = require('nanobus')
const shuffleArray = require('fy-shuffle')
const filter = require('./filter')
const sort = require('./sort')

class AudioLibrary extends Nanobus {
  constructor (state) {
    super('AudioLibrary')

    state = Object.assign({
      trackDict: {},
      order: [],
      shuffleOrder: null,
      index: 0,
      shuffleIndex: 0,
      searchTerm: ''
    }, state)

    this.trackDict = state.trackDict
    this.order = state.order.length
      ? state.order
      : this._search(state.search)
    this.shuffleOrder = Array.isArray(state.shuffleOrder)
      ? state.shuffleOrder
      : null
    this.shuffleIndex = state.shuffleIndex
    this.index = state.index
    this.searchTerm = state.searchTerm

    this.query = null // Set to object so we can clear easily
  }

  persist () {
    return {
      trackDict: this.trackDict,
      order: this.order,
      index: this.index,
      shuffleOrder: this.shuffleOrder,
      shuffleIndex: this.shuffleIndex,
      searchTerm: this.searchTerm
    }
  }

  get isNewQuery () {
    return !!this.query
  }

  get shuffling () {
    return Array.isArray(this.shuffleOrder)
  }

  get currentKey () {
    return this.order[this.index]
  }

  get currentTrack () {
    return this.trackDict[this.currentKey]
  }

  get visibleOrder () {
    if (this.isNewQuery) return this.query.order
    else return this.order
  }

  queue (index) {
    this.index = index

    if (this.isNewQuery) {
      this.order = this.query.order.slice()
      this.searchTerm = this.query.searchTerm
      this.recall()
    }

    if (this.shuffling) this.shuffle()

    return this.currentTrack
  }

  _nextShuffle () {
    const newShuffleIndex = this.shuffleIndex < this.shuffleOrder.length - 1 ? this.shuffleIndex + 1 : 0
    this.index = this.shuffleOrder[newShuffleIndex]
    this.shuffleIndex = newShuffleIndex
    return this.currentTrack
  }

  _next () {
    const newIndex = this.index < this.order.length - 1 ? this.index + 1 : 0
    this.index = newIndex
    return this.currentTrack
  }

  next () { // set and return the next track 🔁
    return this.shuffling ? this._nextShuffle() : this._next()
  }

  _prevShuffle () {
    this.shuffleIndex = this.shuffleIndex > 0 ? this.shuffleIndex - 1 : this.shuffleOrder.length - 1
    this.index = this.shuffleOrder[this.shuffleIndex]
    return this.currentTrack
  }

  _prev () {
    this.index = this.index > 0 ? this.index - 1 : this.order.length - 1
    return this.currentTrack
  }

  prev () { // set and return the prev track 🔁
    return this.shuffling ? this._prevShuffle() : this._prev()
  }

  shuffle () {
    this.shuffleOrder = shuffleArray(Object.keys(this.order).map(Number))
    this.shuffleIndex = this.shuffleOrder.indexOf(this.index)
  }

  unshuffle () {
    this.shuffleOrder = null
    this.shuffleIndex = 0
  }

  _search (term) {
    return term
      ? Object.entries(this.trackDict).filter(filter.bind(null, term)).sort(sort).map(keys)
      : Object.entries(this.trackDict).sort(sort).map(keys)
  }

  search (term) {
    this.query = {
      searchTerm: term,
      order: this._search(term)
    }
    return this.query.order
  }

  recall () { // reset any outstanding queries and show current play order
    this.query = null
    return this.order
  }

  load (newTrackDict) {
    this.trackDict = newTrackDict
    this.search('')
    this.queue(-1)
    return {
      trackDict: this.trackDict,
      order: this.order
    }
  }
}

function keys (entry) {
  return entry[0]
}

module.exports = AudioLibrary
