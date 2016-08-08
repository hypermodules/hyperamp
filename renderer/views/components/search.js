const html = require('choo/html')

module.exports = (state, prev, send) => html`
  <ul class="list-group">
    <li class="list-group-header">
      <input
        type="text"
        class="form-control"
        value=${state.player.search}
        oninput=${(e) => send('player:search', e.target.value)}>
    </li>
  </ul>
`
