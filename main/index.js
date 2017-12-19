var isDev = require('electron-is-dev')
var { app, ipcMain } = require('electron')
var Config = require('electron-store')
var get = require('lodash.get')
var xtend = require('xtend')
var userConfig = require('./config')
var menu = require('./menu')
var artwork = require('./artwork')
var GlobalShortcuts = require('./global-shortcuts')
var makeTrackDict = require('./track-dict')
var audio = require('./windows/audio')
var player = require('./windows/player')
var AudioLibrary = require('./lib/audio-library')
var ipcLogger = require('electron-ipc-log')
var autoUpdater = require('electron-updater').autoUpdater
var log = require('electron-log')

// handle uncaught exceptions before calling any functions
process.on('uncaughtException', (err) => {
  log.error(err)
})

// register sentry if in production
var sentry = isDev ? null : require('../lib/sentry')

// log IPC events
ipcLogger(event => {
  var { channel, data } = event
  if (channel === 'timeupdate') return
  log.info('✨  ipc', channel, ...data)
})

var globalShortcuts = new GlobalShortcuts()
var windows = [player, audio]

var persist = new Config({ name: 'hyperamp-persist' })
var libraryPersist = new Config({ name: 'hyperamp-library' })

var state = xtend({
  paths: [], // USERCONFIG: Paths for searching for songs
  loading: false, // Mutex for performing a scan for new tracks
  volume: 0.50,
  playing: false,
  muted: false
}, persist.store, userConfig.store)

var al = new AudioLibrary(libraryPersist.store)

module.exports = state
module.exports.al = al

var shouldQuit = app.makeSingleInstance(function (commandLine, workingDirectory) {
  // https://github.com/electron/electron/blob/v0.36.10/docs/api/app.md#appmakesingleinstancecallback
  // Someone tried to run a second instance, we should focus our window.
  if (player.win) {
    if (player.win.isMinimized()) player.win.restore()
    player.win.focus()
  } else {
    al.recall()
    player.init()
  }
})

if (shouldQuit) {
  app.exit()
}

app.on('ready', function appReady () {
  menu.init()
  audio.init()
  player.init()
  artwork.init()

  globalShortcuts.init({
    MediaNextTrack: next,
    MediaPreviousTrack: prev,
    MediaPlayPause: playPause
  })

  // register IPC handlers
  ipcMain.on('volume', volume)
  ipcMain.on('queue', queue)
  ipcMain.on('play', play)
  ipcMain.on('pause', pause)
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

  // register autoUpdater
  if (!process.env.DEV_SERVER) {
    setTimeout(() => {
      autoUpdater.checkForUpdatesAndNotify()
    }, 500)
  }

  autoUpdater.on('error', (err) => {
    broadcast('au:error', err)
    if (sentry) sentry.captureException(err)
  })

  autoUpdater.on('checking-for-update', () => {
    log.info('autoUpdater: Checking for update...')
    broadcast('au:checking-for-update')
  })

  autoUpdater.on('update-available', (info) => {
    log.info(`autoUpdater: Update available!`)
    broadcast('au:update-available', info)
  })

  autoUpdater.on('update-not-available', (info) => {
    log.info(`autoUpdater: No update available`)
    broadcast('au:update-not-available', info)
  })

  autoUpdater.on('download-progress', (progress) => {
    broadcast('au:progress', progress)
  })

  autoUpdater.on('update-downloaded', (info) => {
    log.info(`autoUpdater: Update downloaded`)
    broadcast('au:update-downloaded', info)
  })

  // ACTIONS
  // NOTE: I really don't like having all of these actions stuck in this scope.
  // Would be nice to move this to a separate file eventually. -ungoldman

  // Emit things to all windows
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

  function queue (ev, newIndex) {
    var newTrack = al.queue(newIndex)
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
    if (!get(al, `currentTrack.artwork`)) {
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
  }

  function play () {
    state.playing = true
    broadcast('play')
  }

  function pause () {
    state.playing = false
    broadcast('pause')
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
    var newState = al.load(newTrackDict)
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
  globalShortcuts.reregister()
})

app.on('will-quit', function (e) {
  globalShortcuts.unregisterAll()
})

app.on('before-quit', function beforeQuit (e) {
  if (app.isQuitting) return

  app.isQuitting = true
  e.preventDefault()
  setTimeout(function () {
    log.error('Saving state took too long. Quitting.')
    app.quit()
  }, 5000) // quit after 5 secs, at most
  persist.set({
    volume: state.volume
  })

  libraryPersist.set(al.persist())
  app.quit()
})
