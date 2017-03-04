var html = require('choo/html')
var styles = require('./styles')

var defaults = {
  min: 0,
  max: 1,
  step: 0.01
}

function volume (opts) {
  opts = Object.assign({}, defaults, opts)
  var { value, oninput, min, max, step } = opts
  return html`
    <input type="range"
      class="${styles.volumeControl}"
      min="${min}" max="${max}" step="${step}"
      oninput=${oninput}
      value="${value}">
  `
}

module.exports = volume
