const html = require('choo/html')
const icon = require('../icon')

const css = require('csjs')
const fs = require('fs')
const path = require('path')
const insert = require('insert-css')
const rawCSS = fs.readFileSync(path.join(__dirname, 'index.css'), 'utf8')
const buttonCSS = css`${rawCSS}`
insert(css.getCss(buttonCSS))

function button (onclick, iconName, disabled) {
  if (typeof onclick !== 'function') onclick = noop
  if (disabled === undefined) disabled = false
  return html`
        <button class="btn btn-default"
          disabled=${disabled}
          onclick=${onclick}>
          ${icon(iconName)}
        </button>`
}

module.exports = button

function noop () {}
