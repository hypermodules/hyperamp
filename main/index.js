var { app, ipcMain, globalShortcut } = require('electron')
var get = require('lodash.get')
var audio = require('./audio')
var menu = require('./menu')
var player = require('./player')
var Config = require('electron-store')
var userConfig = require('./config')
var artwork = require('./artwork')
var xtend = require('xtend')
// var get = require('lodash.get')
var makeTrackDict = require('./library')

var persist = new Config({ name: 'hyperamp-persist' })

var state = xtend({
  paths: [], // USERCONFIG: Paths for seraching for songs
  trackDict: {}, // object of known tracks
  trackOrder: [], // array of track keys
  trackShuffle: [], // array of track keys, shuffled
  currentIndex: null, // Currently queued track index
  loading: false, // Mutex for performing a scan for new tracks
  search: '', // search string used to derive current trackOrder
  volume: 0.50,
  playing: false,
  muted: false,
  shuffling: true,
  artwork: null
}, persist.store, userConfig.store)

module.exports = state

app.on('ready', () => {
  menu.init()
  audio.init()
  player.init()
  artwork.init()

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
    broadcast('queue', newIndex)
    var key = state.trackOrder[newIndex]
    updateArtwork(key)
  }

  function updateArtwork (key) {
    // Store this kind of crap in main library db
    var blobPath = get(state, `trackDict[${key}].artwork`)
    if (blobPath) {
      return handleArtworkPath(blobPath)
    } else {
      artwork.cache.getPath(key, handleGetPath)
    }

    function handleGetPath (err, blobPath) {
      if (err) return console.error(err)
      state.trackDict[key].artwork = blobPath
      handleArtworkPath(blobPath)
    }
  }

  function handleArtworkPath (blobPath) {
    if (state.artwork !== blobPath) {
      state.artwork = blobPath
      if (player.win) player.win.send('artwork', blobPath)
    }
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
      queue(null, newIndex)
      if (state.playing) { broadcast('play') }
    } else { console.warn('Can\'t go back, empty trackOrder array') }
  }

  ipcMain.on('prev', prev)

  function next () {
    if (state.trackOrder.length > 0) {
      var newIndex = state.currentIndex < state.trackOrder.length - 1 ? state.currentIndex + 1 : 0
      state.currentIndex = newIndex
      queue(null, newIndex)
      if (state.playing) { broadcast('play') }
    } else { console.warn('Can\'t go forward, empty trackOrder array') }
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

  ipcMain.on('shuffle', shuffle)

  function shuffle (ev) {
    state.shuffling = true
    if (player.win) player.win.send('shuffle')
  }

  ipcMain.on('unshuffle', unshuffle)

  function unshuffle (ev) {
    state.shuffling = false
    if (player.win) player.win.send('unshuffle')
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
    broadcast('track-dict', newTrackDict, newTrackOrder, state.paths)
    console.log('done scanning. found ' + Object.keys(newTrackDict).length + ' tracks')
  }

  ipcMain.on('update-library', function (ev, paths) {
    if (state.loading) state.loading.destroy()
    state.paths = paths
    state.loading = makeTrackDict(paths, handleNewTracks)
    console.log('scanning ' + paths)
  })

  function search (ev, searchString) {
    state.search = searchString
    var newTrackOrder = state.trackOrder = Object.keys(state.trackDict)
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
  // sort by albumartist
  // if (aObj.albumartist[0] < bObj.albumartist[0]) return -1
  // if (aObj.albumartist[0] > bObj.albumartist[0]) return 1

  // sort by artist
  // if (aObj.artist[0] < bObj.artist[0]) return -1
  // if (aObj.artist[0] > bObj.artist[0]) return 1

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
    currentIndex: state.currentIndex,
    search: state.search,
    volume: state.volume
  })
  app.quit()
}

app.on('before-quit', beforeQuit)
