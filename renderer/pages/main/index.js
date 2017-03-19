var html = require('choo/html')
var header = require('../../elements/header')
var table = require('../../elements/table')
var footer = require('../../elements/footer')
var styles = require('../styles')

module.exports = main

function main (state, emit) {
  return html`
    <main class="${styles.window}">
      ${header(state, emit)}
      ${table(state, emit)}
      ${footer(state, emit)}
    </main>
  `
}
