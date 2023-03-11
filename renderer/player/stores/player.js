const { ipcRenderer } = require('electron')
const mousetrap = require('mousetrap')
const { trackView } = require('../pages/main').playlist
const remote = require('@electron/remote')

module.exports = playerStore

function getInitialState () {
  const mainState = remote.require('./index.js')
  return {
    playing: mainState.playing,
    currentTime: 0.0,
    currentTrack: mainState.al.currentTrack,
    volume: mainState.volume,
    muted: mainState.muted,
    shuffling: mainState.al.shuffling
  }
}

function playerStore (state, emitter) {
  let localState = state.player
  if (!localState) localState = state.player = getInitialState()

  function render () {
    emitter.emit('render')
  }

  function muted (bool) {
    localState.muted = bool
    render()
  }

  function playing (bool) {
    localState.playing = bool
    render()
  }

  function shuffling (bool) {
    localState.shuffling = bool
  }

  function currentTime (time, shouldRender) {
    localState.currentTime = time
  }

  function volume (lev) {
    localState.volume = lev
  }

  function current (newTrack) {
    localState.currentTrack = newTrack
    render()
    if (!state.library.isNewQuery) {
      window.requestAnimationFrame(() => {
        trackView.scrollCurrent()
      })
    }
  }

  mousetrap.bind('left', e => {
    e.preventDefault()
    emitter.emit('player:prev')
  })
  mousetrap.bind('right', e => {
    e.preventDefault()
    emitter.emit('player:next')
  })
  mousetrap.bind('space', e => {
    e.preventDefault()
    if (localState.playing) emitter.emit('player:pause')
    else emitter.emit('player:play')
  })

  emitter.on('player:play', play)
  emitter.on('player:pause', pause)
  emitter.on('player:prev', prev)
  emitter.on('player:next', next)
  emitter.on('player:mute', mute)
  emitter.on('player:unmute', unmute)
  emitter.on('player:shuffle', shuffle)
  emitter.on('player:unshuffle', unshuffle)
  emitter.on('player:seek', seek)
  emitter.on('player:changeVolume', changeVolume)
  emitter.on('player:time-update', currentTime)

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
    render()
  }

  function prev () {
    ipcRenderer.send('prev')
    currentTime(0)
    render()
  }

  function mute () {
    ipcRenderer.send('mute')
    muted(true)
  }

  function unmute () {
    ipcRenderer.send('unmute')
    muted(false)
  }

  function shuffle () {
    ipcRenderer.send('shuffle')
    shuffling(true)
    render()
  }

  function unshuffle () {
    ipcRenderer.send('unshuffle')
    shuffling(false)
    render()
  }

  function seek (time) {
    window.requestAnimationFrame(() => {
      ipcRenderer.send('seek', time)
      currentTime(time)
      render()
    })
  }

  function changeVolume (lev) {
    ipcRenderer.send('volume', lev)
    volume(lev)
  }

  ipcRenderer.on('play', () => playing(true))
  ipcRenderer.on('pause', () => playing(false))
  ipcRenderer.on('new-track', (ev, newTrack) => current(newTrack))
  ipcRenderer.on('mute', () => muted(true))
  ipcRenderer.on('unmute', () => muted(false))
  ipcRenderer.on('shuffle', () => shuffling(true))
  ipcRenderer.on('unshuffle', () => shuffling(false))
  ipcRenderer.on('volume', (ev, lev) => volume(lev))
  ipcRenderer.on('timeupdate', (ev, time) => {
    currentTime(time)
    render()
  })
}
