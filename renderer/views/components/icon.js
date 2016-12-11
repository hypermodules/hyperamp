const html = require('choo/html')

function icon (name, opts) {
  if (!opts) opts = {}
  const height = opts.height || 10
  const width = opts.width || 10
  return html`<svg width="${width}" height="${height}"><use xlink:href="#${name}" /></svg>`
}

module.exports = icon
