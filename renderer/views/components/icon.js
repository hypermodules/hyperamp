var html = require('choo/html')
var assert = require('assert')

assert.equal(document.body.firstChild.tagName, 'svg', 'svg sprite sheet must be mounted before icons work')

function icon (opts) {
  var name = opts.name
  var height = opts.size || opts.height || '1em'
  var width = opts.size || opts.width || '1em'
  return html`<svg width="${width}" height="${height}"><use xlink:href="#${name}" /></svg>`
}

module.exports = icon
