const html = require('choo/html')
const css = require('csjs-inject')
const fcStyle = require('./form-control').style

const style = css`
  .searchInput {
    width: auto;
    padding: 1px 5px;
    vertical-align: middle;
    min-height: auto;
    margin: 0 4px;
  }
`

function search (oninput) {
  return html`
  <input
    type="text"
    class="${style.searchInput} ${fcStyle.formControl}"
    placeholder="Search"
    oninput=${oninput}>
`
}
module.exports = search
