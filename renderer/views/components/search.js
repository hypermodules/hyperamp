const html = require('choo/html')

module.exports = (state, prev, send) => html`
  <ul class="list-group">
    <li class="list-group-header">
      <input
        type="text"
        class="form-control"
        placeholder="Search"
        oninput=${(e) => send('update', e.target.value)}>
    </li>
  </ul>
`
