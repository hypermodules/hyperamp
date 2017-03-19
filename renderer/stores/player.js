var { ipcRenderer } = require('electron')
var artwork = require('../lib/artwork')

module.exports = playerStore

function playerStore (state, emitter) {
  var localState = state.player

  if (!localState) {
    localState.playing = false
    localState.current = {}
    localState.volume = 50
    localState.muted = false
    localState.currentTime = 0
  }

  emitter.on('player:muted', muted)
  emitter.on('player:playing', playing)
  emitter.on('player:currentTime', currentTime)
  emitter.on('player:volume', volume)
  emitter.on('player:current', current)
  emitter.on('player:picture', picture)

  function muted (bool) {
    localState.muted = bool
    emitter.emit('render')
  }

  function playing (bool) {
    localState.playing = bool
    emitter.emit('render')
  }

  function currentTime (time) {
    localState.currentTime = time
    emitter.emit('render')
  }

  function volume (time) {
    localState.volume = time
    emitter.emit('render')
  }

  function current (time) {
    localState.current = time
    emitter.emit('render')
  }

  function picture (time) {
    localState.current = time
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

  function queue (meta) {
    ipcRenderer.send('queue', meta)
    emitter.emit('player:current', meta)
    artwork(meta.filepath, (err, hash) => {
      if (err) return emitter.emit('error', err)
      emitter.emit('player:picture', hash)
    })
  }

  function play () {
    ipcRenderer.send('play')
    emitter.emit('player:playing', true)
  }

  function pause () {
    ipcRenderer.send('pause')
    emitter.emit('player:playing', false)
  }

  function next () {
    ipcRenderer.send('next')
  }

  function prev () {
    ipcRenderer.send('prev')
  }

  function mute () {
    ipcRenderer.send('unmute')
    emitter.emit('player:muted', true)
  }

  function unmute () {
    ipcRenderer.send('mute')
    emitter.emit('player:muted', false)
  }

  function updatePlaylist (playlist) {
    ipcRenderer.send('playlist', playlist)
  }

  function seek (time) {
    ipcRenderer.send('seek', time)
    emitter.emit('player:currentTime', time)
  }

  function changeVolume (lev) {
    ipcRenderer.send('volume', lev)
    emitter.emit('player:volume', lev)
  }

  ipcRenderer.on('play', () => emitter.emit('player:playing', true))
  ipcRenderer.on('pause', () => emitter.emit('player:playing', false))
  ipcRenderer.on('queue', (ev, meta) => emitter.emit('player:current', meta))
  ipcRenderer.on('mute', () => emitter.emit('player:muted', true))
  ipcRenderer.on('unmute', () => emitter.emit('player:muted', true))
  ipcRenderer.on('volume', (ev, lev) => emitter.emit('player:volume', lev))
  ipcRenderer.on('timeupdate', (ev, time) => emitter.emit('player:currentTime', time))
  ipcRenderer.on('syncState', (ev, mainState) => {
    localState.playing = state.playing
    localState.current = state.current
    localState.volume = state.volume
    localState.muted = state.muted
    emitter.emit('render')
  })
}
