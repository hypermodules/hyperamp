const css = require('csjs-inject')

const style = css`
  .formControl {
    display: inline-block;
    width: 100%;
    min-height: 25px;
    padding: var(--padding-less) var(--padding);
    font-family: var(--font-family-default);
    font-size: var(--font-size-default);
    line-height: var(--line-height-default);
    background: var(--lighten);
    border: var(--border);
    border-radius: var(--default-border-radius);
    outline: none;
  }

  .formControl:focus {
    border-color: var(--focus-input-color);
    box-shadow: 0 0 0 1px var(--focus-input-color);
  }
`

module.exports.style = style
