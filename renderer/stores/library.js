var ipcRenderer = require('electron').ipcRenderer

module.exports = libraryStore

function libraryStore (state, emitter) {
  var localState = state.library

  if (!localState) {
    localState = state.library = {}
    localState.trackDict = {}
    localState.trackOrder = []
    localState.search = ''
    localState.selectedIndex = null
  }

  emitter.on('library:search', search)
  emitter.on('library:update-library', updateLibrary)
  emitter.on('library:update-track-dict', updateTrackDict)
  emitter.on('library:update-track-order', updateTrackOrder)
  emitter.on('library:select', select)

  function updateTrackDict (newTrackDict) {
    localState.trackDict = newTrackDict
  }

  function updateTrackOrder (newTrackOrder) {
    localState.trackOrder = newTrackOrder
  }

  function updateLibrary (paths) {
    ipcRenderer.emit('update-library', paths)
  }

  function search (string) {
    ipcRenderer.emit('search')
    localState.search = string
  }

  function select (selectedIndex) {
    localState.selectedIndex = selectedIndex
    emitter.emit('render')
  }

  function syncState (ev, mainState) {
    localState.search = mainState.search
    localState.trackDict = mainState.trackDict
    localState.trackOrder = mainState.trackOrder
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
