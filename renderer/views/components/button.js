const html = require('choo/html')
const icon = require('./icon')
const css = require('csjs-inject')

const style = css`
  .btn {
    display: flex;
    align-items: center;
    padding: 3px 8px;
    margin-bottom: 0;
    font-size: 1em;
    line-height: 1.4;
    height: 24px;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    background-image: none;
    border: 1px solid transparent;
    border-radius: var(--default-border-radius);
    box-shadow: 0 1px 1px rgba(0,0,0,.06);
    -webkit-app-region: no-drag;
    color: #fff;
    border: var(--border);
    background: var(--lighten);
    box-sizing: border-box;
  }

  .btn svg {
    fill: #fff;
  }

  .btn:active {
    background-color: #ddd;
    background-image: none;
  }

  .btn:focus {
    outline: none;
    box-shadow: none;
  }

  .btn[disabled] svg {
    fill: gainsboro;
  }

  .btn[disabled]:active {
    background-color: #fcfcfc;
    background: linear-gradient(to bottom, #fcfcfc 0%, #f1f1f1 100%);
  }

  .btnGroup {
    display: flex;
    flex-direction: row;
  }

  .btnGroup {
    display: flex;
    flex-direction: row;
  }

  .btnGroup .btn:not(:last-child) {
    border-right: none;
  }

  .btnGroup .btn:not(:first-child):not(:last-child) {
    border-radius: 0;
  }

  .btnGroup .btn:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .btnGroup .btn:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`

function button (onclick, iconName, disabled) {
  if (typeof onclick !== 'function') onclick = noop
  if (disabled === undefined) disabled = false
  return html`
        <button class="${style.btn}"
          disabled=${disabled}
          onclick=${onclick}>
          ${icon(iconName)}
        </button>`
}

module.exports = button
module.exports.style = style

function noop () {}
