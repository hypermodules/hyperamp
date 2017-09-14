var css = require('csjs-inject')

module.exports = css`
  .form {
    padding-bottom: 1em;
    margin-bottom: 1em;
    border-bottom: var(--border);
  }

  .formControl {
    color: var(--copy);
    display: inline-block;
    width: 100%;
    min-height: 25px;
    padding: var(--padding-less) var(--padding);
    font-family: var(--font-family-default);
    font-size: var(--font-size-default);
    font-weight: var(--font-weight-default);
    line-height: var(--line-height-default);
    background: var(--darken);
    border: var(--border);
    border-radius: var(--default-border-radius);
    outline: none;
  }

  .formControl:focus {
    border: 1px solid var(--darker);
  }

  .formGroup {
    display: flex;
    align-items: center;
  }

  .formGroup label {
    margin-right: 1em;
    width: 30%;
    white-space: nowrap;
  }

  .formGroup input {
    display: inline-flex;
    flex; 1;
  }
`
