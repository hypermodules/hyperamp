var html = require('choo/html')
var formStyles = require('../form/styles')
// var component = require('nanocomponent')
var styles = require('./styles')

function search ({ oninput, value }) {
  return html`
    <input type="search"
      class="${formStyles.formControl} ${styles.searchInput}"
      placeholder="Search"
      value="${value}"
      oninput=${oninput}>
  `
}

module.exports = search
