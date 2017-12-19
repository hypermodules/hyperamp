var html = require('choo/html')
var styles = require('./styles')

function btnGroup (props, children) {
  var { className } = props
  return html`
    <div class="${styles.btnGroup} ${className || ''}">
      ${children || ''}
    </div>
  `
}

module.exports = btnGroup
