var Component = require('cache-component')
var html = require('choo/html')
var assert = require('assert')
var styles = require('./styles')

function Range (opts) {
  if (!(this instanceof Range)) return new Range()
  if (!opts) opts = {}
  this._opts = Object.assign({
    min: 0,
    max: 1,
    default: 0.5,
    step: 0.01,
    id: ''
  }, opts)
  this._value = this._opts.default
  this._onchange = null
  this._className = styles.range
  this._handleInput = this._handleInput.bind(this)
  Component.call(this)
}

Range.prototype = Object.create(Component.prototype)

Range.prototype._handleInput = function (e) {
  if (this._onchange) this._onchange(this._element.value)
}

Range.prototype._render = function ({value, onchange, className}) {
  assert.equal(typeof onchange, 'function', 'Range: onchange should be a function')

  this._onchange = onchange
  this._value = value
  if (className !== undefined) this._className = className

  return html`
    <input type='range'
        id='${this._opts.id}'
        class='${this._className ? this._className : ''}'
        min='${this._opts.min}'
        max='${this._opts.max}'
        step='${this._opts.step}'
        oninput=${this._handleInput}
        value='${this._value}'>
  `
}

// Lets mutate!
Range.prototype._update = function ({value, onchange, className}) {
  assert.equal(typeof onchange, 'function', 'Range: onchange should be a function')

  if (this.onchange !== onchange) {
    this._onchange = onchange
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
