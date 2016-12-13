const html = require('choo/html')
const compile = require('es6-template-strings/compile')
const resolve = require('es6-template-strings/resolve')
const icon = require('../icon')

const css = require('csjs')
const fs = require('fs')
const path = require('path')
const insert = require('insert-css')
const rawCSS = fs.readFileSync(path.join(__dirname, 'index.css'), 'utf8')
const compiled = compile(rawCSS)
const buttonCSS = css.apply(null, resolve(compiled, {}))

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
