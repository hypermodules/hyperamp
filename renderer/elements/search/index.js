var html = require('choo/html')
var formStyles = require('../form/styles')
var component = require('nanocomponent')
var styles = require('./styles')

var search = component({
  render: function ({ oninput }) {
    return html`
    <input type="search"
      class="${formStyles.formControl} ${styles.searchInput}"
      placeholder="Search"
      oninput=${oninput}>
  `
  }
})

module.exports = search
