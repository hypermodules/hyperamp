var { app, ipcMain, globalShortcut } = require('electron')
var Config = require('electron-store')
var get = require('lodash.get')
var xtend = require('xtend')
var userConfig = require('./config')
var menu = require('./menu')
var artwork = require('./artwork')
var makeTrackDict = require('./track-dict')
var audio = require('./windows/audio')
var player = require('./windows/player')
var AudioLibrary = require('./lib/audio-library')

var persist = new Config({ name: 'hyperamp-persist' })
var libraryPersist = new Config({ name: 'hyperamp-library' })

var state = xtend({
  paths: [], // USERCONFIG: Paths for searching for songs
  loading: false, // Mutex for performing a scan for new tracks
  volume: 0.50,
  playing: false,
  muted: false,
  artwork: null
}, persist.store, userConfig.store)

var al = new AudioLibrary(libraryPersist)

module.exports = state
module.exports.al = al

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
    var newTrack = al.queue(newIndex)
    broadcast('queue', newTrack)
    if (!get(al, `currentTrack.artwork`)) updateArtwork(al.currentKey)
  }

  function updateArtwork (key) {
    artwork.cache.getPath(key, handleGetPath)
  }

  function handleGetPath (err, blobPath) {
    if (err) return console.error(err)
    al.currentTrack.artwork = blobPath
    if (player.win) player.win.send('queue', al.currentTrack)
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
    broadcast('queue', al.prev())
    if (state.playing) { broadcast('play') }
  }

  ipcMain.on('prev', prev)

  function next () {
    broadcast('queue', al.next())
    if (state.playing) { broadcast('play') }
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
    al.shuffle()
    if (player.win) player.win.send('shuffle')
  }

  ipcMain.on('unshuffle', unshuffle)

  function unshuffle (ev) {
    al.unshuffle()
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
    broadcast('loading', false)
    if (err) return console.warn(err)
    var newState = al.load(newTrackDict)
    if (player.win) player.win.send('track-dict', newState.trackDict, newState.order, state.paths)
    console.log('done scanning. found ' + Object.keys(newState.trackDict).length + ' tracks')
  }

  ipcMain.on('update-library', function (ev, paths) {
    if (state.loading) state.loading.destroy()
    state.paths = paths
    state.loading = makeTrackDict(paths, handleNewTracks)
    console.log('scanning ' + paths)
    broadcast('loading', true)
  })

  function search (ev, searchString) {
    if (player.win) player.win.send('track-order', al.search(searchString))
  }

  ipcMain.on('search', search)

  // Sync All State to anyone who asks for it

  function syncState (ev) {
    ev.sender.send('sync-state', Object.assign({}, state, al.persist()))
  }

  ipcMain.on('sync-state', syncState)

  // System Shortcuts

  globalShortcut.register('MediaNextTrack', next)
  globalShortcut.register('MediaPreviousTrack', prev)
  globalShortcut.register('MediaPlayPause', playPause)
// globalShortcut.register('MediaStop', stop)
})

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

  libraryPersist.set(al.persist())

  app.quit()
})

process.on('uncaughtException', (err) => {
  console.log(err)
})
