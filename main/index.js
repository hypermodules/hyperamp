var { app, ipcMain, globalShortcut } = require('electron')
var audio = require('./audio')
var menu = require('./menu')
var player = require('./player')
var Config = require('electron-config')
var xtend = require('xtend')
var get = require('lodash.get')
var makeTrackDict = require('./library')

var persist = new Config({ name: 'hyperamp-persist' })

var state = xtend({
  trackDict: {}, // object of known tracks
  trackOrder: [], // array of track keys
  currentIndex: null, // Currently queued track index
  loading: false, // Mutex for performing a scan for new tracks
  search: '', // search string used to derive current trackOrder
  volume: 0.50,
  playing: false,
  muted: false
}, persist.store)

module.exports = state

app.on('ready', () => {
  menu.init()
  audio.init()
  player.init()

  // Emit things to all windows
  var windows = [player, audio]
  function broadcast (/* args */) {
    var args = [].slice.call(arguments, 0)
    windows.forEach((winObj) => {
      if (winObj.win) winObj.win.send.apply(winObj.win, args)
    })
  }

  function volume (ev, level) {
    // player -> audio
    state.volume = level
    if (audio.win) audio.win.send('volume', level)
  }

  ipcMain.on('volume', volume)

  function queue (ev, newIndex) {
    state.currentIndex = newIndex
    var key = state.trackOrder[newIndex]
    var filePath = get(state.trackDict[key], 'filepath')
    if (audio.win && filePath) audio.win.send('queue', filePath)
    if (player.win) player.win.send('queue', newIndex)
    broadcast('queue', newIndex)
  }

  ipcMain.on('queue', queue)

  function play () {
    state.playing = true
    broadcast('play')
  }

  ipcMain.on('play', play)

  function pause () {
    state.playing = false
    broadcast('pause')
  }

  ipcMain.on('pause', pause)

  function playPause () {
    state.playing ? pause() : play()
  }

  function prev () {
    if (state.trackOrder.length > 0) {
      var newIndex = state.currentIndex > 0 ? state.currentIndex - 1 : state.trackOrder.length - 1
      state.currentIndex = newIndex
      broadcast('queue', newIndex)
      if (state.playing) { broadcast('play') }
    } else { console.warn('Can go back, empty trackOrder array') }
  }

  ipcMain.on('prev', prev)

  function next () {
    if (state.trackOrder.length > 0) {
      var newIndex = state.currentIndex < state.trackOrder.length - 1 ? state.currentIndex + 1 : 0
      state.currentIndex = newIndex
      broadcast('queue', newIndex)
      if (state.playing) { broadcast('play') }
    } else { console.warn('Can go forward, empty trackOrder array') }
  }

  ipcMain.on('next', next)

  function mute (ev) {
    state.muted = true
    broadcast('mute')
  }

  ipcMain.on('mute', mute)

  function unmute (ev) {
    state.muted = false
    broadcast('unmute')
  }

  ipcMain.on('unmute', unmute)

  function timeupdate (ev, currentTime) {
    // audio -> player
    state.currentTime = currentTime
    if (player.win) player.win.send('timeupdate', currentTime)
  }

  ipcMain.on('timeupdate', timeupdate)

  function seek (ev, newTime) {
    // player -> audio
    state.currentTime = newTime
    if (audio.win) audio.win.send('seek', newTime)
  }

  ipcMain.on('seek', seek)

  function handleNewTracks (err, newTrackDict) {
    state.loading = false
    if (err) return console.warn(err)
    state.trackDict = newTrackDict
    var newTrackOrder = state.trackOrder = Object.keys(newTrackDict)
                                            .filter(filterList(state.search))
                                            .sort(sortList)
    broadcast('update-library', newTrackDict, newTrackOrder)
  }

  ipcMain.on('update-library', function (ev, paths) {
    if (state.loading) state.loading.destroy()
    state.loading = makeTrackDict(handleNewTracks)
  })

  function search (ev, searchString) {
    state.search = searchString
    var newTrackOrder = state.trackOrder = Object.keys(state.TrackDict)
                                              .filter(filterList(state.search))
                                              .sort(sortList)
    broadcast('track-order', newTrackOrder)
  }

  ipcMain.on('search', search)

  // Sync All State to anyone who asks for it

  function syncState (ev) {
    ev.sender.send('sync-state', state)
  }

  ipcMain.on('sync-state', syncState)

  // System Shortcuts

  globalShortcut.register('MediaNextTrack', next)
  globalShortcut.register('MediaPreviousTrack', prev)
  globalShortcut.register('MediaPlayPause', playPause)
  // globalShortcut.register('MediaStop', stop)
})

function sortList (keyA, keyB) {
  var aObj = state.trackDict[keyA]
  var bObj = state.trackDict[keyB]
    // sort by artist
  if (aObj.artist < bObj.artist) return -1
  if (aObj.artist > bObj.artist) return 1

    // then by album
  if (aObj.album < bObj.album) return -1
  if (aObj.album > bObj.album) return 1

    // then by title
  if (aObj.title < bObj.title) return -1
  if (aObj.title > bObj.title) return 1
  return 0
}

function filterList (search) {
  return function (key) {
    var meta = state.trackDict[key]
    var yep = Object.keys(meta)
      .map(i => (meta[i] + '').toLowerCase())
      .filter(s => s.includes(search.toLowerCase()))
      .length > 0

    if (yep) return meta
    return false
  }
}

function allWindowsClosed () {
  if (process.platform !== 'darwin') app.quit()
}

app.on('window-all-closed', allWindowsClosed)

function activate () {
  if (player.win === null) player.init()
}

app.on('activate', activate)

function beforeQuit (e) {
  if (app.isQuitting) return

  app.isQuitting = true
  e.preventDefault()
  setTimeout(function () {
    console.error('Saving state took too long. Quitting.')
    app.quit()
  }, 5000) // quit after 5 secs, at most
  persist.set({
    trackDict: state.trackDict,
    trackOrder: state.trackOrder,
    currentKey: state.currentKey,
    currentIndex: state.currentIndex,
    search: state.search,
    volume: state.volume
  })
  app.quit()
}

app.on('before-quit', beforeQuit)
