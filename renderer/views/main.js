const html = require('choo/html')
const toolbar = require('./components/toolbar')
const table = require('./components/table')
const styles = require('./styles')

module.exports = (state, prev, send) => html`
  <main class="${styles.window}">
    ${toolbar(state, prev, send)}
    ${table(state, prev, send)}
  </main>
`
