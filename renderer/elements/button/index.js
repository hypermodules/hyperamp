var html = require('choo/html')
var icon = require('../icon')
var styles = require('./styles')

function button ({ onclick, iconName, disabled }, children) {
  return html`
    <button class="${styles.btn}"
      disabled=${disabled || false}
      onclick=${onclick || null}>
      ${iconName ? icon({ name: iconName }) : null}
      ${children || null}
    </button>
  `
}

module.exports = button
