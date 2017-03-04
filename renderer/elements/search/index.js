var html = require('choo/html')
var formStyles = require('../form/styles')
var styles = require('./styles')

function search ({ oninput }) {
  return html`
    <input type="search"
      class="${formStyles.formControl} ${styles.searchInput}"
      placeholder="Search"
      oninput=${oninput}>
  `
}

module.exports = search
