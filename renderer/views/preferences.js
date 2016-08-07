const html = require('choo/html')
const table = require('./components/table')

module.exports = (state, prev, send) => html`
  <main class="window">
    <header class="toolbar toolbar-header">
      <h1 class="title"><span class="icon icon-note-beamed"></span> ${state.title}</h1>
    </header>
    <div class="window-content">
      <div class="pane-group">
        <div class="pane">
          ${table(state, prev, send)}
        </div>
      </div>
    </div>
  </main>
`
