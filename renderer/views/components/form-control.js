const css = require('csjs')
const insert = require('insert-css')

const style = css`
  .form-control {
    display: inline-block;
    width: 100%;
    min-height: 25px;
    padding: var(--padding-less) var(--padding);
    font-size: var(--font-size-default);
    line-height: var(--line-height-default);
    background-color: var(--chrome-color);
    border: 1px solid var(--border-color);
    border-radius: var(--default-border-radius);
    outline: none;
  }

  .form-control:focus {
    border-color: var(--focus-input-color);
    box-shadow: 0 0 0 1px var(--focus-input-color);
  }
`

insert(css.getCss(style))

module.exports.style = style
