var Component = require('cache-component')
var html = require('choo/html')
var styles = require('./styles')

function Range (opts) {
  if (!(this instanceof Range)) return new Range()
  if (!opts) opts = {}
  this._opts = Object.assign({
    min: 0,
    max: 1,
    default: 0.5,
    step: 0.01
  }, opts)
  this._value = this._opts.default
  this._onchange = null
  this._id = this._opts.id
  this._className = styles.range
  this._handleInput = this.handleInput.bind(this)
  Component.call(this)
}
Range.prototype = Object.create(Component.prototype)

Range.prototype.handleInput = function (e) {
  if (this._onchange) this._onchange(e.target.value)
}

Range.prototype._render = function ({value, onchange, className}) {
  this._onchange = onchange
  this._value = value
  this._className = className
  return html`
    <input type='range'
        id='${this._id}'
        class='${this._className}'
        min='${this._opts.min}'
        max='${this._opts.max}'
        step='${this._opts.step}'
        oninput=${this.handleInput}
        value='${this._value}'>
  `
}

// Lets mutate!
Range.prototype._update = function ({value, onchange, className}) {
  if (this.onchange !== onchange) {
    this._onchange = onchange
    this._element.oninput = onchange
  }
  if (this.className !== className) {
    this.className = className
    this._element.class = className
  }
  if (this._value !== value) {
    // Mutate value changes
    this._value = value
    this._element.value = this._value
  }
  return false
}

module.exports = Range
