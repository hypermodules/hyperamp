var ipcRenderer = require('electron').ipcRenderer
var mousetrap = require('mousetrap')
var { COLUMNS } = require('../lib/constants')
var trackView = require('../pages/main').playlist.trackView

window.trackView = trackView

module.exports = libraryStore

function getInitialState () {
  var mainState = require('electron').remote.require('./index.js')
  return {
    paths: mainState.paths,
    trackDict: {},
    trackOrder: [],
    currentIndex: mainState.al.index,
    search: mainState.al.searchTerm,
    selectedIndex: null,
    isNewQuery: false,
    loading: false,
    columns: Array.from(COLUMNS).reduce((obj, col) => {
      obj[col] = true
      return obj
    }, {})
  }
}

function libraryStore (state, emitter) {
  var localState = state.library
  if (!localState) localState = state.library = getInitialState()

  mousetrap.bind('up', e => {
    e.preventDefault()
    var idx = localState.selectedIndex
    var newIdx = idx == null || idx === 0
      ? 0
      : idx - 1
    emitter.emit('library:select', newIdx)
    trackView.scrollTo(newIdx)
  })
  mousetrap.bind('down', e => {
    e.preventDefault()
    var idx = localState.selectedIndex
    var newIdx = idx == null
      ? 0
      : idx === localState.trackOrder.length - 1
        ? localState.trackOrder.length - 1
        : idx + 1
    emitter.emit('library:select', newIdx)
    trackView.scrollTo(newIdx)
  })
  mousetrap.bind('enter', e => {
    e.preventDefault()
    var idx = localState.selectedIndex
    if (idx != null) {
      emitter.emit('library:queue', idx)
      emitter.emit('player:play')
    }
  })
  mousetrap.bind('esc', e => {
    e.preventDefault()
    emitter.emit('library:select')
  })

  emitter.on('library:search', search)
  emitter.on('library:update-library', updateLibrary)
  emitter.on('library:track-dict', updateTrackDict)
  emitter.on('library:track-order', updateTrackOrder)
  emitter.on('library:paths', updatePaths)
  emitter.on('library:select', select)
  emitter.on('library:columns', updateColumns)
  emitter.on('library:current-index', updateIndex)
  emitter.on('library:queue', queue)
  emitter.on('library:new-query', updateQueryState)
  emitter.on('library:recall', recall)

  function recall () {
    if (!localState.isNewQuery) return trackView.scrollCurrent()
    ipcRenderer.send('recall')
  }

  function queue (newIndex) {
    ipcRenderer.send('queue', newIndex)
  }

  function updateColumns (col) {
    localState.columns[col] = !localState.columns[col]
    emitter.emit('render')
  }

  function updateQueryState (state) {
    localState.isNewQuery = state
  }

  function updateTrackDict (newTrackDict) {
    localState.trackDict = newTrackDict
  }

  function updateTrackOrder (newTrackOrder) {
    localState.trackOrder = newTrackOrder
  }

  function updatePaths (newPaths) {
    localState.paths = newPaths
  }

  function updateIndex (newIndex) {
    localState.currentIndex = newIndex
  }

  function loading (bool) {
    localState.loading = bool
    emitter.emit('render')
  }

  function updateLibrary (paths) {
    window.requestAnimationFrame(() => {
      ipcRenderer.send('update-library', paths)
    })
  }

  function search (string) {
    ipcRenderer.send('search', string)
    localState.search = string
    trackView.scrollTo(0)
  }

  function select (selectedIndex) {
    localState.selectedIndex = selectedIndex
    emitter.emit('render')
  }

  ipcRenderer.on('loading', (ev, isLoading) => loading(isLoading))
  ipcRenderer.on('track-dict', (ev, newTrackDict, newTrackOrder, newPaths) => {
    window.requestAnimationFrame(() => {
      emitter.emit('library:track-dict', newTrackDict)
      emitter.emit('library:track-order', newTrackOrder)
      emitter.emit('library:paths', newPaths)
      emitter.emit('render')
    })
  })
  ipcRenderer.on('track-order', (ev, newTrackOrder) => {
    window.requestAnimationFrame(() => {
      emitter.emit('library:track-order', newTrackOrder)
      emitter.emit('render')
    })
  })
  ipcRenderer.on('new-index', (ev, newIndex) => {
    emitter.emit('library:current-index', newIndex)
    emitter.emit('render')
  })
  ipcRenderer.on('is-new-query', (ev, queryState) => {
    emitter.emit('library:new-query', queryState)
    emitter.emit('render')
  })
  ipcRenderer.on('recall', (ev, order, searchTerm) => {
    localState.trackOrder = order
    localState.search = searchTerm
    localState.isNewQuery = false
    emitter.emit('render')
    trackView.scrollCurrent()
  })
  ipcRenderer.on('sync-state', (ev, data) => {
    var {trackDict, order, paths} = data
    window.requestAnimationFrame(() => {
      emitter.emit('library:track-dict', trackDict)
      emitter.emit('library:track-order', order)
      emitter.emit('library:paths', paths)
      emitter.emit('render')
      trackView.scrollCurrent()
    })
  })
}
