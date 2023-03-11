const html = require('choo/html')
const icon = require('../icon')
const styles = require('./styles')

function button (props, children) {
  const { className, onclick, iconName, disabled } = props
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
