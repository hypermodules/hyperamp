var html = require('choo/html')
var header = require('../../elements/header')
var table = require('../../elements/table')
var footer = require('../../elements/footer')
var styles = require('../styles')

module.exports = (state, emit) => html`
  <main class="${styles.window}">
    ${header(state, prev, send)}
    ${table(state, prev, send)}
    ${footer(state, prev, send)}
  </main>
`
