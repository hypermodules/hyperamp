const html = require('choo/html')
const css = require('sheetify')

const style = css`
  :host {
    display: flex;
  }
`

module.exports = (player, send) => {
  function play () {
    if (player.playing) return send('player:pause')
    send('player:play')
  }

  return html`
    <div class="${style}">
      <div class="btn-group">
        <button class="btn btn-default"
          disabled
          onclick=${() => send('player:prev')}>
          <span class="icon icon-fast-backward"></span>
        </button>
        <button class="btn btn-default"
          onclick=${play}>
          <span class="icon icon-${player.playing ? 'pause' : 'play'}"></span>
        </button>
        <button class="btn btn-default"
          disabled
          onclick=${() => send('player:next')}>
          <span class="icon icon-fast-forward"></span>
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
