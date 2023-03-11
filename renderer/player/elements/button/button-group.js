const html = require('choo/html')
const styles = require('./styles')

function btnGroup (props, children) {
  const { className } = props
  return html`
    <div class="${styles.btnGroup} ${className || ''}">
      ${children || ''}
    </div>
  `
}

module.exports = btnGroup
