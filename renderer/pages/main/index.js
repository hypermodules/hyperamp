var html = require('choo/html')
var Header = require('../../elements/header')
var table = require('../../elements/table')
var footer = require('../../elements/footer')
var styles = require('../styles')

module.exports = main

var header = new Header()

function main (state, emit) {
  return html`
    <main class="${styles.window}">
      ${footer(state, emit)}
      <div>
        ${header.render(state, emit)}
        ${table(state, emit)}
      </div>
    </main>
  `
}
