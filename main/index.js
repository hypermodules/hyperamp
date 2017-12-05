var isDev = require('electron-is-dev')
var sentry
if (!isDev) {
  sentry = require('../sentry')
}
var { app, ipcMain } = require('electron')
var Config = require('electron-store')
var get = require('lodash.get')
var xtend = require('xtend')
var userConfig = require('./config')
var menu = require('./menu')
var artwork = require('./artwork')
var GlobalShortcuts = require('./globalShortcuts')
var makeTrackDict = require('./track-dict')
var audio = require('./windows/audio')
var player = require('./windows/player')
var AudioLibrary = require('./lib/audio-library')
var ipcLogger = require('electron-ipc-log')
var globalShortcuts = new GlobalShortcuts()
var autoUpdater = require('electron-updater').autoUpdater

ipcLogger(event => {
  var { channel, data } = event
  console.log('✨  ipc', channel, ...data)
})

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
    console.log(newTrack)
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
    if (err) return console.error(err)
    al.currentTrack.artwork = blobPath
    if (player.win) {
      player.win.send('new-track', al.currentTrack)
      player.win.send('new-index', al.index)
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
    broadcast('new-track', al.prev())
    if (player.win) player.win.send('new-index', al.index)
    if (state.playing) { broadcast('play') }
    updateArtwork()
  }

  ipcMain.on('prev', prev)

  function next () {
    broadcast('new-track', al.next())
    if (player.win) player.win.send('new-index', al.index)
    if (state.playing) { broadcast('play') }
    updateArtwork()
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
    console.timeEnd('update-library')
    console.log('Done scanning. Found ' + Object.keys(newState.trackDict).length + ' tracks.')
  }

  ipcMain.on('update-library', function (ev, paths) {
    if (state.loading) state.loading.destroy()
    console.log('Updating library with new path(s): ' + paths)
    console.time('update-library')
    state.paths = paths
    state.loading = makeTrackDict(paths, handleNewTracks)
    broadcast('loading', true)
  })

  function search (ev, searchString) {
    if (player.win) {
      player.win.send('track-order', al.search(searchString))
      player.win.send('is-new-query', al.isNewQuery)
    }
  }

  ipcMain.on('search', search)

  function recall () {
    if (player.win) player.win.send('recall', al.recall(), al.searchTerm)
  }

  ipcMain.on('recall', recall)

  ipcMain.on('sync-state', (ev) => {
    ev.sender.send('sync-state', {
      trackDict: al.trackDict,
      order: al.order,
      paths: state.paths
    })
  })

  if (process.platform !== 'darwin') { // TODO System tray on windows (maybe linux)
    // since window-all-closed doesn't fire with our hidden audio process
    player.win.once('closed', () => {
      app.quit()
    })
  }

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
    console.log('autoUpdater: Checking for update...')
    broadcast('au:checking-for-update')
  })

  autoUpdater.on('update-available', (info) => {
    console.log(`autoUpdater: Update available!`)
    broadcast('au:update-available', info)
  })

  autoUpdater.on('update-not-available', (info) => {
    console.log(`autoUpdater: No update available`)
    broadcast('au:update-not-available', info)
  })

  autoUpdater.on('download-progress', (progress) => {
    broadcast('au:progress', progress)
  })

  autoUpdater.on('update-downloaded', (info) => {
    console.log(`autoUpdater: Update downloaded`)
    broadcast('au:update-downloaded', info)
  })
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
    console.error('Saving state took too long. Quitting.')
    app.quit()
  }, 5000) // quit after 5 secs, at most
  persist.set({
    volume: state.volume
  })

  libraryPersist.set(al.persist())
  app.quit()
})

process.on('uncaughtException', (err) => {
  console.log(err)
})
