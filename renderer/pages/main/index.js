var html = require('choo/html')
var toolbar = require('../../elements/toolbar')
var table = require('../../elements/table')
var styles = require('../styles')

module.exports = (state, prev, send) => html`
  <main class="${styles.window}">
    ${toolbar(state, prev, send)}
    ${table(state, prev, send)}
  </main>
`
