var html = require('choo/html')
var css = require('csjs-inject')
var fcStyle = require('./form-control').style

var style = css`
  .searchInput {
    width: auto;
    padding: 1px 5px;
    vertical-align: middle;
    min-height: auto;
    margin: 0 5px;
    height: 24px;
  }
`

function search ({ oninput }) {
  return html`
    <input type="search"
      class="${fcStyle.formControl} ${style.searchInput}"
      placeholder="Search"
      oninput=${oninput}>
  `
}

module.exports = search
