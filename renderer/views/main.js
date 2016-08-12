const html = require('choo/html')
const toolbar = require('./components/toolbar')
const table = require('./components/table')

module.exports = (state, prev, send) => html`
  <main class="window">
    ${toolbar(state, prev, send)}
    <div class="window-content">
      <div class="pane-group">
        <div class="pane">
          ${table(state, prev, send)}
        </div>
      </div>
    </div>
  </main>
`
