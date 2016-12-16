const html = require('choo/html')
const assert = require('assert')

assert.equal(document.body.firstChild.tagName, 'svg', 'svg sprite sheet must be mounted before icons work')

function icon (name, opts) {
  if (!opts) opts = {}
  const height = opts.height || '1em'
  const width = opts.width || '1em'
  return html`<svg width="${width}" height="${height}"><use xlink:href="#${name}" /></svg>`
}

module.exports = icon
