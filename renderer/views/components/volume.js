const html = require('choo/html')
const css = require('csjs')
const insert = require('insert-css')

const style = css`
  .volume-control {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    -webkit-app-region: no-drag;
    width: 100px;
    margin: 0 4px;
  }
`
insert(css.getCss(style))

module.exports = volume

const defaults = {
  min: 0,
  max: 1,
  step: 0.01,
  style: style
}

function volume (value, oninput, opts) {
  opts = Object.assign({}, defaults, opts)
  const { min, max, step, style } = opts
  return html`
  <input type="range"
    class="${style['volume-control']}"
    min="${min}" max="${max}" step="${step}"
    oninput=${oninput}
    value="${value}">
`
}
