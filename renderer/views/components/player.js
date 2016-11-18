const html = require('choo/html')
const css = require('csjs')
const insert = require('insert-css')

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
        <button class="btn btn-default"
          disabled
          onclick=${() => send('player:prev')}>
          <svg style="height: 10px; width: 10px"><use xlink:href="#controller-fast-backward" /></svg>
        </button>
        <button class="btn btn-default"
          onclick=${play}>
          <svg style="height: 10px; width: 10px"><use xlink:href="#controller-play" /></svg>
        </button>
        <button class="btn btn-default"
          disabled
          onclick=${() => send('player:next')}>
          <svg style="height: 10px; width: 10px"><use xlink:href="#controller-fast-forward" /></svg>
        </button>
      </div>

      <input type="range"
        class="volume-control"
        min="0.0" max="1.0" step="0.01"
        oninput=${(e) => send('player:volume', { volume: e.target.value })}
        value="${player.volume}">
    </div>
  `
}
