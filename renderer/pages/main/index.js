var html = require('choo/html')
var Header = require('../../elements/header')
var table = require('../../elements/table')
var Footer = require('../../elements/footer')
var footer = new Footer()
var styles = require('../styles')

module.exports = main

var header = new Header()

function main (state, emit) {
  return html`
    <main class="${styles.window}">
      <div class="${styles.grow}">
        ${header.render(state, emit)}
        ${table(state, emit)}
      </div>
      ${footer.render(state, emit)}
    </main>
  `
}
