var html = require('choo/html')
var styles = require('./styles')
var button = require('../button')
var buttonStyles = require('../button/styles')

var opts = {
  min: 0,
  max: 100,
  step: 0.1
}

function play (state, send) {
  if (state.player.playing) return send('player:pause')
  send('player:play')
}

module.exports = (state, prev, send) => {
  var current = state.player.current || {}
  var title = current.title || null
  var artist = current.artist || null
  var album = current.album || null
  var progress = (state.player.currentTime / state.player.current.duration) * opts.max
  return html`
    <footer class="${styles.footer}">
      <div class="${styles.albumArt}"></div>
      <div class="${styles.meta}">
        <p class="${styles.title}">${title || 'No Track Selected'}</p>
        <p class="${styles.artist}">
          ${Array.isArray(artist) ? artist.join(', ') : artist || 'No Artist'}
          ${album != null && album !== '' ? ` - ${album}` : null}
        </p>
        <div class="${buttonStyles.btnGroup} ${styles.controls}">
          ${button({
            onclick: () => send('player:prev'),
            iconName: 'entypo-controller-fast-backward'
          })}
          ${button({
            onclick: () => play(state, send),
            iconName: `entypo-controller-${state.player.playing ? 'paus' : 'play'}`
          })}
          ${button({
            onclick: () => send('player:next'),
            iconName: 'entypo-controller-fast-forward'
          })}
          ${button({ className: styles.scrubberControl }, html`
            <input type='range'
              class='${styles.scrubber}'
              min='${opts.min}' max='${opts.max}' step='${opts.step}'
              oninput=${(e) => send('player:seek', (e.target.value / opts.max) * state.player.current.duration)}
              disabled=${title === null}
              value=${progress}>
          `)}
        </div>
      </div>
    </footer>
  `
}
