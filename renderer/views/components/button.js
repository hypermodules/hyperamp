const html = require('choo/html')
const icon = require('./icon')
const css = require('csjs-inject')

const style = css`
  .btn {
    display: inline-flex;
    align-items: center;
    padding: 3px 8px;
    margin-bottom: 0;
    font-size: 1em;
    line-height: 1.4;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    background-image: none;
    border: 1px solid transparent;
    border-radius: var(--default-border-radius);
    box-shadow: 0 1px 1px rgba(0,0,0,.06);
    -webkit-app-region: no-drag;
  }

  .btn:focus {
      outline: none;
      box-shadow: none;
  }

  .btn[disabled]:active {
    background-color: #fcfcfc;
    background: linear-gradient(to bottom, #fcfcfc 0%, #f1f1f1 100%);
  }

  .btn[disabled] .icon {
    color: gainsboro;
  }

  /* Normal buttons */
  .btn-default {
    color: #fff;
    border: var(--border);
    background: var(--lighten);
  }
  .btn-default svg {
    fill: #fff;
  }
  .btn-default:active {
    background-color: #ddd;
    background-image: none;
  }
`

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
