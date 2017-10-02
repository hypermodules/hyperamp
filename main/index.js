var { app, ipcMain, globalShortcut } = require('electron')
var Config = require('electron-store')
var get = require('lodash.get')
var xtend = require('xtend')
var shuffleArray = require('fy-shuffle')
var userConfig = require('./config')
var menu = require('./menu')
var artwork = require('./artwork')
var makeTrackDict = require('./track-dict')
var audio = require('./windows/audio')
var player = require('./windows/player')

var persist = new Config({ name: 'hyperamp-persist' })

var state = xtend({
  paths: [], // USERCONFIG: Paths for searching for songs
  trackDict: {}, // object of known tracks
  trackOrder: [], // array of track keys
  currentIndex: null, // Currently queued track index
  loading: false, // Mutex for performing a scan for new tracks
  search: '', // search string used to derive current trackOrder
  volume: 0.50,
  playing: false,
  muted: false,
  shuffling: false,
  artwork: null
}, persist.store, userConfig.store)

module.exports = state

app.on('ready', function appReady () {
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
      app.dock.setIcon(blobPath)
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
    var newTrackOrder = shuffleArray(state.trackOrder)
    state.trackOrder = newTrackOrder
    if (player.win) player.win.send('shuffle')
    broadcast('track-order', newTrackOrder)
  }

  ipcMain.on('unshuffle', unshuffle)

  function unshuffle (ev) {
    state.shuffling = false
    if (player.win) player.win.send('unshuffle')
    var newTrackOrder = state.trackOrder.sort(sortList)
    state.trackOrder = newTrackOrder
    broadcast('track-order', newTrackOrder)
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
    broadcast('loading', false)
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
    broadcast('loading', true)
  })

  function search (ev, searchString) {
    state.search = searchString
    var newTrackOrder = Object.keys(state.trackDict)
        .filter(filterList(state.search))
    if (!state.shuffling) {
      newTrackOrder = newTrackOrder.sort(sortList)
    } else {
      newTrackOrder = shuffleArray(newTrackOrder)
    }
    state.trackOrder = newTrackOrder
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

function filterList (search) {
  return function (key) {
    var meta = state.trackDict[key]
    var { title, album, artist } = meta
    var artistStr = Array.isArray(artist) ? artist.join(', ') : artist
    var trackStr = (title + album + artistStr).toLowerCase().replace(/\s+/g, '')

    return trackStr.includes(search.toLowerCase().replace(/\s+/g, ''))
  }
}

app.on('window-all-closed', function allWindowsClosed () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function activate () {
  if (player.win === null) player.init()
})

app.on('before-quit', function beforeQuit (e) {
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
    volume: state.volume,
    shuffling: state.shuffling
  })
  app.quit()
})

process.on('uncaughtException', (err) => {
  console.log(err)
})
