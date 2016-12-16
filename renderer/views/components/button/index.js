const html = require('choo/html')
const icon = require('../icon')
const css = require('csjs-inject')
const fs = require('fs')
const path = require('path')

const rawCSS = fs.readFileSync(path.join(__dirname, 'index.css'), 'utf8')
const style = css`${rawCSS}`

function button (onclick, iconName, disabled) {
  if (typeof onclick !== 'function') onclick = noop
  if (disabled === undefined) disabled = false
  return html`
        <button class="${style.btn} ${style['btn-default']}"
          disabled=${disabled}
          onclick=${onclick}>
          ${icon(iconName)}
        </button>`
}

module.exports = button

function noop () {}
