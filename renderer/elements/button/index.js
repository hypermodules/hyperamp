var html = require('choo/html')
var icon = require('../icon')
var styles = require('./styles')

function button (props, children) {
  var { className, onclick, iconName, disabled } = props
  return html`
    <button class="${styles.btn} ${className || ''}"
      disabled=${disabled || false}
      onclick=${onclick || null}>
      ${iconName ? icon({ name: iconName }) : null}
      ${children || ''}
    </button>
  `
}

module.exports = button
