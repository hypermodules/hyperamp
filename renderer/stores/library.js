var ipcRenderer = require('electron').ipcRenderer

module.exports = libraryStore

function libraryStore (state, emitter) {
  var localState = state.library

  if (!localState) {
    localState = state.library = {}
    localState.currentKey = null
    localState.currentIndex = null
    localState.selectedKey = null
    localState.selectedIndex = null
    localState.trackDict = {}
    localState.trackOrder = []
    localState.search = ''
  }

  emitter.on('library:search', search)
  emitter.on('library:update-library', updateLibrary)
  emitter.on('library:update-track-dict', updateTrackDict)
  emitter.on('library:update-track-order', updateTrackOrder)

  function updateTrackDict (newTrackDict) {
    localState.trackDict = newTrackDict
  }

  function updateTrackOrder (newTrackOrder) {
    localState.trackOrder = newTrackOrder
  }

  function updateLibrary () {
    ipcRenderer.emit('update-library')
  }

  function search (string) {
    ipcRenderer.emit('search')
    localState.search = string
    emitter.emit('render')
  }

  function syncState (ev, mainState) {
    localState.search = mainState.search
    emitter.emit('library:update-track-dict', mainState.trackDict)
    emitter.emit('library:update-track-order', mainState.trackOrder)
    emitter.emit('render')
  }

  ipcRenderer.on('sync-state', syncState)
  ipcRenderer.on('track-dict', (ev, newTrackDict) => {
    updateTrackDict(newTrackDict)
    emitter.emit('render')
  })
  ipcRenderer.on('track-order', (ev, newTrackOrder) => {
    updateTrackOrder(newTrackOrder)
    emitter.emit('render')
  })
  ipcRenderer.on('update-library', (ev, newTrackDict, newTrackOrder) => {
    updateTrackDict(newTrackDict)
    updateTrackOrder(newTrackOrder)
    emitter.emit('render')
  })
}

// TODO: expose sort to state to allow sort using column headers
function sortList (files) {
  return files.sort((a, b) => {
    // sort by artist
    if (a.artist < b.artist) return -1
    if (a.artist > b.artist) return 1

    // then by album
    if (a.album < b.album) return -1
    if (a.album > b.album) return 1

    // then by title
    if (a.title < b.title) return -1
    if (a.title > b.title) return 1
    return 0
  })
}

function filterList (list, search) {
  return list.filter(meta => {
    var yep = Object.keys(meta)
      .map(i => (meta[i] + '').toLowerCase())
      .filter(s => s.includes(search.toLowerCase()))
      .length > 0

    if (yep) return meta
    return false
  })
}
