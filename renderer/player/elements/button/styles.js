const css = require('csjs-inject')

module.exports = css`
  .btn {
    display: inline-flex;
    align-items: center;
    padding: 3px 8px;
    margin-bottom: 0;
    font-size: 1em;
    line-height: 1.4;
    min-height: 24px;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    background-image: none;
    border: 1px solid transparent;
    border-radius: var(--default-border-radius);
    -webkit-app-region: no-drag;
    color: var(--copy);
    background: transparent;
  }

  .btn svg { fill: var(--copy) }
  .btn.inverse svg { fill: var(--bg) }
  .btn:active, .btn.active { color: var(--link) }
  .btn:active svg, .btn.active svg { fill: var(--link) }
  .btn[disabled] svg { fill: var(--lighter) }
  .btn[disabled] { background-color: var(--bg) }

  .btn:focus {
    outline: none;
    box-shadow: none;
  }

  .btnGroup {
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
  }

  .btnGroup .btn:not(:last-child) { border-right: none }
  .btnGroup .btn:not(:first-child):not(:last-child) { border-radius: 0 }

  .btnGroup .btn:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .btnGroup .btn:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`
