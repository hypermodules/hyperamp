const html = require('choo/html')
const css = require('csjs')
const insert = require('insert-css')
const fcStyle = require('./form-control').style

const style = css`
  .searchInput {
    width: auto;
    padding: 1px 5px;
    vertical-align: middle;
    border-color: #ccc;
    min-height: auto;
  }
`
insert(css.getCss(style))

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
