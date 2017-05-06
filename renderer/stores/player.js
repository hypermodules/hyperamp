var { ipcRenderer } = require('electron')

module.exports = playerStore

function playerStore (state, emitter) {
  var localState = state.player

  if (!localState) {
    localState = state.player = {}
    localState.playing = false
    localState.currentIndex = 0
    localState.currentTime = 0.0
    localState.volume = 0.50
    localState.muted = false
    localState.pictureHash = null
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

  function current (newIndex) {
    localState.currentIndex = newIndex
    emitter.emit('render')
  }

  emitter.on('player:queue', queue)
  emitter.on('player:play', play)
  emitter.on('player:pause', pause)
  emitter.on('player:prev', prev)
  emitter.on('player:next', next)
  emitter.on('player:mute', mute)
  emitter.on('player:unmute', unmute)
  emitter.on('player:seek', seek)
  emitter.on('player:changeVolume', changeVolume)
  emitter.on('player:sync-state', syncState)
  emitter.on('player:time-update', currentTime)

  function queue (newIndex) {
    ipcRenderer.send('queue', newIndex)
    current(newIndex)
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
    currentTime(0)
    emitter.emit('render')
  }

  function prev () {
    ipcRenderer.send('prev')
    currentTime(0)
    emitter.emit('render')
  }

  function mute () {
    ipcRenderer.send('mute')
    muted(true)
  }

  function unmute () {
    ipcRenderer.send('unmute')
    muted(false)
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
    localState.currentIndex = mainState.currentIndex
    localState.volume = mainState.volume
    localState.muted = mainState.muted
    emitter.emit('render')
  }

  ipcRenderer.on('play', () => playing(true))
  ipcRenderer.on('pause', () => playing(false))
  ipcRenderer.on('queue', (ev, newIndex) => current(newIndex))
  ipcRenderer.on('mute', () => muted(true))
  ipcRenderer.on('unmute', () => muted(false))
  ipcRenderer.on('volume', (ev, lev) => volume(lev))
  ipcRenderer.on('timeupdate', (ev, time) => {
    currentTime(time)
    emitter.emit('render')
  })
  ipcRenderer.on('sync-state', (ev, mainState) => emitter.emit('player:sync-state', mainState))
}
