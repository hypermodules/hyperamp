const electron = require('electron')
const { app, ipcMain } = electron
const remoteMain = require('@electron/remote/main')
remoteMain.initialize()
const Config = require('electron-store')
const get = require('lodash.get')
const xtend = require('xtend')
const userConfig = require('./config')
const menu = require('./menu')
const artwork = require('./artwork')
const makeTrackDict = require('./track-dict')
const audio = require('./windows/audio')
const player = require('./windows/player')
const AudioLibrary = require('./lib/audio-library')
const log = require('electron-log')

// handle uncaught exceptions before calling any functions
process.on('uncaughtException', (err) => {
  log.error(err)
})

const windows = [player, audio]

const persist = new Config({ name: 'hyperamp-persist' })
const libraryPersist = new Config({ name: 'hyperamp-library' })

const state = xtend({
  paths: [], // USERCONFIG: Paths for searching for songs
  loading: false, // Mutex for performing a scan for new tracks
  volume: 0.50,
  playing: false,
  muted: false
}, persist.store, userConfig.store)

const al = new AudioLibrary(libraryPersist.store)

module.exports = state
module.exports.al = al

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
}

app.on('second-instance', (commandLine, workingDirectory) => {
  //
  // Someone tried to run a second instance, we should focus our window.
  if (player.win) {
    if (player.win.isMinimized()) player.win.restore()
    player.win.focus()
  } else {
    al.recall()
    player.init()
  }
})

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')

app.on('ready', function appReady () {
  menu.init()
  audio.init()
  player.init()
  artwork.init()

  electron.powerMonitor.on('suspend', function pauseOnWake () {
    log.info('Entering sleep, pausing')
    ipcMain.emit('pause')
  })

  // register IPC handlers
  ipcMain.on('volume', volume)
  ipcMain.on('queue', queue)
  ipcMain.on('play', play)
  ipcMain.on('playing', playing)
  ipcMain.on('pause', pause)
  ipcMain.on('paused', paused)
  ipcMain.on('prev', prev)
  ipcMain.on('next', next)
  ipcMain.on('mute', mute)
  ipcMain.on('unmute', unmute)
  ipcMain.on('shuffle', shuffle)
  ipcMain.on('unshuffle', unshuffle)
  ipcMain.on('timeupdate', timeupdate)
  ipcMain.on('seek', seek)
  ipcMain.on('update-library', updateLibrary)
  ipcMain.on('search', search)
  ipcMain.on('recall', recall)
  ipcMain.on('sync-state', syncState)

  // ACTIONS
  // NOTE: I really don't like having all of these actions stuck in this scope.
  // Would be nice to move this to a separate file eventually. -ungoldman

  // Emit things to all windows
  function broadcast (/* args */) {
    const args = [].slice.call(arguments, 0)
    windows.forEach((winObj) => {
      if (winObj.win) winObj.win.send.apply(winObj.win, args)
    })
  }

  function volume (ev, level) {
    // player -> audio
    state.volume = level
    if (audio.win) audio.win.send('volume', level)
  }

  function queue (ev, newIndex) {
    const newTrack = al.queue(newIndex)
    log.info(newTrack)
    broadcast('new-track', newTrack)
    if (player.win) {
      player.win.send('new-index', al.index)
      player.win.send('is-new-query', al.isNewQuery)
    }
    if (state.playing) { broadcast('play') }
    updateArtwork()
  }

  function updateArtwork () {
    if (!get(al, 'currentTrack.artwork')) {
      artwork.cache.getPath(al.currentKey, handleGetPath)
    }
  }

  function handleGetPath (err, blobPath) {
    if (err) return log.error(err)
    al.currentTrack.artwork = blobPath
    if (player.win) {
      player.win.send('new-track', al.currentTrack)
      player.win.send('new-index', al.index)
    }
    if (audio.win) {
      audio.win.send('new-artwork', al.currentTrack)
    }
  }

  function play () {
    state.playing = true
    broadcast('play')
  }

  function playing () {
    state.playing = true
    broadcast('playing')
  }

  function pause () {
    state.playing = false
    broadcast('pause')
  }

  function paused () {
    state.playing = false
    broadcast('paused')
  }

  function playPause () {
    state.playing ? pause() : play()
  }

  function prev () {
    broadcast('new-track', al.prev())
    if (player.win) player.win.send('new-index', al.index)
    if (state.playing) { broadcast('play') }
    updateArtwork()
  }

  function next () {
    broadcast('new-track', al.next())
    if (player.win) player.win.send('new-index', al.index)
    if (state.playing) { broadcast('play') }
    updateArtwork()
  }

  function mute (ev) {
    state.muted = true
    broadcast('mute')
  }

  function unmute (ev) {
    state.muted = false
    broadcast('unmute')
  }

  function timeupdate (ev, currentTime) {
    // audio -> player
    state.currentTime = currentTime
    if (player.win) player.win.send('timeupdate', currentTime)
  }

  function shuffle (ev) {
    al.shuffle()
    if (player.win) player.win.send('shuffle')
  }

  function unshuffle (ev) {
    al.unshuffle()
    if (player.win) player.win.send('unshuffle')
  }

  function seek (ev, newTime) {
    // player -> audio
    state.currentTime = newTime
    if (audio.win) audio.win.send('seek', newTime)
  }

  function handleNewTracks (err, newTrackDict) {
    state.loading = false
    broadcast('loading', false)
    if (err) return log.warn(err)
    const newState = al.load(newTrackDict)
    if (player.win) player.win.send('track-dict', newState.trackDict, newState.order, state.paths)
    console.timeEnd('update-library')
    log.info('Done scanning. Found ' + Object.keys(newState.trackDict).length + ' tracks.')
  }

  function updateLibrary (ev, paths) {
    if (state.loading) state.loading.destroy()
    log.info('Updating library with new path(s): ' + paths)
    console.time('update-library')
    state.paths = paths
    state.loading = makeTrackDict(paths, handleNewTracks)
    broadcast('loading', true)
  }

  function search (ev, searchString) {
    if (player.win) {
      player.win.send('track-order', al.search(searchString))
      player.win.send('is-new-query', al.isNewQuery)
    }
  }

  function recall () {
    if (player.win) player.win.send('recall', al.recall(), al.searchTerm)
  }

  function syncState (event) {
    event.sender.send('sync-state', {
      trackDict: al.trackDict,
      order: al.order,
      paths: state.paths
    })
  }
})

app.on('activate', function activate () {
  if (player.win === null) {
    al.recall()
    player.init()
  }
})

app.on('will-quit', function (e) {
  // nothing
})

app.on('before-quit', function beforeQuit (e) {
  if (app.isQuitting) return

  app.isQuitting = true
  e.preventDefault()
  setTimeout(function () {
    log.error('Saving state took too long. Quitting.')
    app.quit()
  }, 20000) // quit after 5 secs, at most
  persist.set({
    volume: state.volume
  })

  libraryPersist.set(al.persist())
  app.quit()
})
