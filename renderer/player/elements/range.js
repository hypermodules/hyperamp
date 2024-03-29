const Component = require('nanocomponent')
const html = require('choo/html')
const assert = require('assert')
const css = require('csjs-inject')

const styles = css`
  .range {
    cursor: default;
    position: relative;
    vertical-align: middle;
    -webkit-app-region: no-drag;
    width: 100%;
  }
`

class Range extends Component {
  constructor (opts) {
    if (!opts) opts = {}
    super(opts)
    this._opts = Object.assign({
      min: 0,
      max: 1,
      default: 0.5,
      step: 0.01,
      id: ''
    }, opts)
    this._value = this._opts.default
    this._onchange = null
    this._disabled = false
    this._className = styles.range
    this._handleInput = this._handleInput.bind(this)
  }

  _handleInput (e) {
    if (this._onchange) this._onchange(this.element.value)
  }

  createElement ({ value, onchange, className, disabled }) {
    assert.strict.equal(typeof onchange, 'function', 'Range: onchange should be a function')

    this._onchange = onchange
    this._value = value
    if (className !== undefined) this._className = className
    this._disabled = disabled

    return html`
      <input type='range'
          id='${this._opts.id}'
          class='${this._className ? this._className : ''}'
          min='${this._opts.min}'
          max='${this._opts.max}'
          step='${this._opts.step}'
          ${this._disabled ? 'disabled' : ''}
          oninput=${this._handleInput}
          value='${this._value}'>
    `
  }

  // Lets mutate!
  update ({ value, onchange, className, disabled }) {
    assert.strict.equal(typeof onchange, 'function', 'Range: onchange should be a function')

    if (this._onchange !== onchange) {
      this._onchange = onchange
    }
    if (this._className !== className) {
      this._className = className
      this.element.class = className
    }
    if (this._value !== value) {
      // Mutate value changes
      this._value = value
      this.element.value = this._value
    }
    if (this._disabled !== disabled) {
      this._disabled = disabled
      if (this._disabled) {
        this.element.setAttribute('disabled', '')
      } else {
        this.element.removeAttribute('disabled')
      }
    }
    return false
  }
}

module.exports = Range
