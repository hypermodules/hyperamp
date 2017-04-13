var { ipcRenderer } = require('electron')
var artwork = require('../lib/artwork')

module.exports = playerStore

function playerStore (state, emitter) {
  var localState = state.player

  if (!localState) {
    localState = state.player = {}
    localState.playing = false
    localState.current = {}
    localState.selected = {}
    localState.volume = 0.50
    localState.muted = false
    localState.currentTime = 0.1
    localState.picture = null
  }

  function muted (bool) {
    localState.muted = bool
    emitter.emit('render')
  }

  function playing (bool) {
    localState.playing = bool
    emitter.emit('render')
  }

  function currentTime (time, shouldRender) {
    localState.currentTime = time
  }

  function volume (lev) {
    localState.volume = lev
  }

  function current (meta) {
    localState.current = meta
    emitter.emit('render')
  }

  function picture (hash) {
    localState.picture = hash
    emitter.emit('render')
  }

  function select (meta) {
    localState.selected = meta
    emitter.emit('render')
  }

  emitter.on('player:queue', queue)
  emitter.on('player:play', play)
  emitter.on('player:pause', pause)
  emitter.on('player:prev', prev)
  emitter.on('player:next', next)
  emitter.on('player:mute', mute)
  emitter.on('player:unmute', unmute)
  emitter.on('player:updatePlaylist', updatePlaylist)
  emitter.on('player:seek', seek)
  emitter.on('player:changeVolume', changeVolume)
  emitter.on('player:sync-state', syncState)
  emitter.on('player:time-update', currentTime)
  emitter.on('player:select', select)

  function queue (meta) {
    ipcRenderer.send('queue', meta)
    current(meta)
    artwork(meta.filepath, (err, hash) => {
      if (err) return emitter.emit('error', err)
      picture(hash)
    })
  }

  function play () {
    ipcRenderer.send('play')
    playing(true)
  }

  function pause () {
    ipcRenderer.send('pause')
    playing(false)
  }

  function next () {
    ipcRenderer.send('next')
  }

  function prev () {
    ipcRenderer.send('prev')
  }

  function mute () {
    ipcRenderer.send('mute')
    muted(true)
  }

  function unmute () {
    ipcRenderer.send('unmute')
    muted(false)
  }

  function updatePlaylist (playlist) {
    ipcRenderer.send('playlist', playlist)
  }

  function seek (time) {
    ipcRenderer.send('seek', time)
    currentTime(time)
  }

  function changeVolume (lev) {
    ipcRenderer.send('volume', lev)
    volume(lev)
  }

  function syncState (mainState) {
    localState.playing = mainState.playing
    localState.current = mainState.current
    localState.volume = mainState.volume
    localState.muted = mainState.muted
    emitter.emit('render')
  }

  ipcRenderer.on('play', () => playing(true))
  ipcRenderer.on('pause', () => playing(false))
  ipcRenderer.on('queue', (ev, meta) => current(meta))
  ipcRenderer.on('mute', () => muted(true))
  ipcRenderer.on('unmute', () => muted(false))
  ipcRenderer.on('volume', (ev, lev) => volume(lev))
  ipcRenderer.on('timeupdate', (ev, time) => {
    emitter.emit('player:time-update', time)
    emitter.emit('render')
  })
  ipcRenderer.on('sync-state', (ev, mainState) => emitter.emit('player:sync-state', mainState))
}
