var libStream = require('../lib/library')
var config = require('electron').remote.require('./config.js')
var ipcRenderer = require('electron').ipcRenderer
var nanotick = require('nanotick')
var tick = nanotick()

module.exports = libraryStore

function libraryStore (state, emitter) {
  var localState = state.library

  if (!localState) {
    localState = state.library = {}
    localState.files = []
    localState.search = ''
  }

  emitter.on('library:clear', clear)
  emitter.on('library:addOne', addOne)
  emitter.on('library:search', search)
  emitter.on('library:loadSongs', loadSongs)
  emitter.on('library:files', files)
  emitter.on('library:sort', sort)

  ipcRenderer.on('sync-state', syncState)

  function syncState (ev, mainState) {
    emitter.emit('library:files', mainState.playlist)
  }

  function clear () {
    localState.files = []
    emitter.emit('render')
  }

  function addOne (meta) {
    localState.files.push(meta)
    emitter.emit('render')
  }

  function loadSongs () {
    emitter.emit('library:clear')
    libStream(config.get('music'), handleFile)
  }

  function handleFile (err, meta) {
    if (err) return emitter.emit('error', err)
    emitter.emit('library:addOne', meta)
  }

  function files (playlist) {
    localState.files = playlist
    emitter.emit('render')
  }

  function sort () {
    tick(function () {
      emitter.emit('library:files', sortList(localState.files))
    })
  }

  function search (string) {
    localState.search = string
    emitter.emit('render')
  }
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
