var html = require('choo/html')
var debounce = require('lodash.debounce')
// var fd = require('format-duration')
var styles = require('./styles')
var button = require('../button')
var buttonStyles = require('../button/styles')
var artworkCache = require('../../lib/artwork-cache')

var opts = {
  min: 0,
  max: 100,
  step: 0.1
}

function play (state, emit) {
  if (state.player.playing) return emit('player:pause')
  emit('player:play')
}

module.exports = (state, emit) => {
  var current = state.player.current || {}
  var title = current.title || null
  var artist = current.artist || null
  var album = current.album || null
  var progress = (state.player.currentTime / state.player.current.duration) * opts.max
  var backgroundImg = artworkCache[state.player.picture]
  return html`
    <footer class="${styles.footer}">
      <div
        style="background-image: ${state.player.picture ? 'url(' + backgroundImg + ')' : ''}"
        class="${styles.albumArt}">
      </div>
      <div class="${styles.meta}">
        <p class="${styles.title}">${title || 'No Track Selected'}</p>
        <p class="${styles.artist}">
          ${Array.isArray(artist) ? artist.join(', ') : artist || 'No Artist'}
          ${album != null && album !== '' ? ` - ${album}` : null}
        </p>
        <div class="${buttonStyles.btnGroup} ${styles.controls}">
          ${button({
            onclick: () => emit('player:prev'),
            iconName: 'entypo-controller-fast-backward'
          })}
          ${button({
            onclick: () => play(state, emit),
            iconName: `entypo-controller-${state.player.playing ? 'paus' : 'play'}`
          })}
          ${button({
            onclick: () => emit('player:next'),
            iconName: 'entypo-controller-fast-forward'
          })}
          ${button({ className: styles.scrubberControl }, html`
            <input id='position' type='range'
              class='${styles.scrubber}'
              min='${opts.min}' max='${opts.max}' step='${opts.step}'
              oninput=${debounce(
                (e) => emit('player:seek', (e.target.value / opts.max) * state.player.current.duration),
                50, { maxWait: 200 })}
              disabled=${title === null}
              value=${progress.toPrecision(3)}>
          `)}
        </div>
      </div>
    </footer>
  `
}

// <div>${fd(state.player.currentTime * 1000)} -${fd((state.player.current.duration - state.player.currentTime) * 1000)}</div>
