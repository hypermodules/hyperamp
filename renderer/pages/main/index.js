var html = require('choo/html')
var Header = require('../../elements/header')
var Table = require('../../elements/table')
var Footer = require('../../elements/footer')

var styles = require('../styles')

module.exports = main

// TODO instantiate these
var header = new Header()
var table = new Table()
var footer = new Footer()

function main (state, emit) {
  return html`
    <main class="${styles.window}">
      <div class="${styles.grow}">
        ${header.render(state, emit)}
        ${table.render(state, emit)}
      </div>
      ${footer.render(state, emit)}
    </main>
  `
}
