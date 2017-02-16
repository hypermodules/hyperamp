var html = require('choo/html')
var css = require('csjs-inject')
var assign = Object.assign

var style = css`
  .volumeControl {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    -webkit-app-region: no-drag;
    width: 100px;
    margin: 0 5px;
  }
`

var defaults = {
  min: 0,
  max: 1,
  step: 0.01,
  style: style
}

function volume (opts) {
  opts = assign({}, defaults, opts)
  var { value, oninput, min, max, step, style } = opts
  return html`
    <input type="range"
      class="${style.volumeControl}"
      min="${min}" max="${max}" step="${step}"
      oninput=${oninput}
      value="${value}">
  `
}

module.exports = volume
