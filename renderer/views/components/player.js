const html = require('choo/html')
const css = require('sheetify')
const { buttons } = require('./styles')

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
    <div class="${style} ${buttons}">
      <div class="btn-group">
        <button class="btn btn-default"
          disabled
          onclick=${() => send('player:prev')}>
          <object
            type="image/svg+xml"
            data="icons/controller-fast-backward.svg"
            class="icon">
          </object>
        </button>
        <button class="btn btn-default"
          onclick=${play}>
          <object
            type="image/svg+xml"
            data="icons/controller-${player.playing ? 'paus' : 'play'}.svg"
            class="icon">
          </object>
        </button>
        <button class="btn btn-default"
          disabled
          onclick=${() => send('player:next')}>
          <object
            type="image/svg+xml"
            data="icons/controller-fast-forward.svg"
            class="icon">
          </object>
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
