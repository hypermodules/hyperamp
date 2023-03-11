const html = require('choo/html')
const assert = require('assert')

assert.strict.equal(document.body.firstChild.tagName, 'svg', 'svg sprite sheet must be mounted before icons work')

function icon (opts) {
  const name = opts.name
  const height = opts.size || opts.height || '1em'
  const width = opts.size || opts.width || '1em'
  return html`<svg width="${width}" height="${height}"><use xlink:href="#${name}" /></svg>`
}

module.exports = icon
