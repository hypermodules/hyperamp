const html = require('choo/html')

module.exports = (state, prev, send) => html`
  <input
    type="text"
    class="search-input form-control"
    placeholder="Search"
    oninput=${(e) => send('library:search', e.target.value)}>
`
