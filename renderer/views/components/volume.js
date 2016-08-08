const html = require('choo/html')

module.exports = (val, send) => html`
  <input type="range"
    class="volume-control"
    min="0" max="100"
    oninput=${(e) => send('player:volume', e.target.value)}
    value="${val}">
`
