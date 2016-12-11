const html = require('choo/html')
const css = require('csjs')
const insert = require('insert-css')
const button = require('./button')

const style = css`
  .player {
    display: flex;
  }
`

insert(css.getCss(style))

module.exports = (player, send) => {
  function play () {
    if (player.playing) return send('player:pause')
    send('player:play')
  }

  return html`
    <div class="${style.player}">
      <div class="btn-group">
        ${button(() => send('player:prev'), 'controller-fast-backward', true)}
        ${button(play, 'controller-play', false)}
        ${button(() => send('player:next'), 'controller-fast-forward', true)}
      </div>

      <input type="range"
        class="volume-control"
        min="0.0" max="1.0" step="0.01"
        oninput=${(e) => send('player:volume', { volume: e.target.value })}
        value="${player.volume}">
    </div>
  `
}
