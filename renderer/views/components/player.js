const html = require('choo/html')

module.exports = (player, send) => html`
  <section class="player">
    <div class="btn-group">
      <button class="btn btn-default"
        disabled
        onclick=${() => send('player:prev')}>
        <span class="icon icon-fast-backward"></span>
      </button>
      <button class="btn btn-default"
        disabled="${player.filepath ? 'false' : 'true'}"
        onclick=${() => send('player:playing', { playing: !player.playing })}>
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
      oninput=${(e) => send('player:volume', e.target.value)}
      value="${player.volume}">
  </section>
`
