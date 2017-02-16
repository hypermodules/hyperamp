var html = require('choo/html')
var toolbar = require('./components/toolbar')
var table = require('./components/table')
var styles = require('./styles')

module.exports = (state, prev, send) => html`
  <main class="${styles.window}">
    ${toolbar(state, prev, send)}
    ${table(state, prev, send)}
  </main>
`
