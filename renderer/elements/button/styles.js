var css = require('csjs-inject')

module.exports = css`
  .btn {
    display: flex;
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
    box-shadow: 0 1px 1px rgba(0,0,0,.06);
    -webkit-app-region: no-drag;
    color: var(--copy);
    border: var(--border);
    background: transparent;
  }

  .btn svg {
    fill: var(--copy);
  }

  .btn:active {
    color: var(--link);
    border: var(--border);
  }

  .btn:active svg {
    fill: var(--link);
  }

  .btn:focus {
    outline: none;
    box-shadow: none;
  }

  .btn[disabled] svg {
    fill: var(--lighter);
  }

  .btn[disabled] {
    background-color: var(--bg);
  }

  .btnGroup {
    display: flex;
    flex-direction: row;
  }

  .btnGroup {
    display: flex;
    flex-direction: row;
    margin-right: 1em;
  }

  .btnGroup:last-child { margin-right: 0 }

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
