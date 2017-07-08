var html = require('choo/html')
var formStyles = require('../form/styles')
var styles = require('./styles')
var assert = require('assert')
var Component = require('cache-component')

function Search (opts) {
  if (!(this instanceof Search)) return new Search(opts)
  if (!opts) opts = {}
  this._opts = Object.assign({
    id: ''
  }, opts)
  this._value = ''
  this._onchange = null
  this._className = `${formStyles.formControl} ${styles.searchInput}`
  this._handleInput = this._handleInput.bind(this)
  Component.call(this)
}

Search.prototype = Object.create(Component.prototype)

Search.prototype._handleInput = function (ev) {
  if (this._onchange) this._onchange(this.element.value)
}

Search.prototype._render = function ({ onchange, value, className }) {
  assert.equal(typeof onchange, 'function', 'Search: onchange should be a function')

  this._onchange = onchange
  this._value = value
  if (className !== undefined) this._className = className

  return html`
    <input type='search'
      class='${this._className ? this._className : ''}'
      placeholder='Search'
      value='${this._value}'
      oninput=${this._handleInput}>
  `
}

// Lets mutate!
Search.prototype._update = function ({value, onchange, className}) {
  assert.equal(typeof onchange, 'function', 'Range: onchange should be a function')

  if (this.onchange !== onchange) {
    this._onchange = onchange
  }
  if (this.className !== className) {
    this.className = className
    this.element.class = className
  }
  if (this._value !== value) {
    // Mutate value changes
    this._value = value
    this.element.value = this._value
  }
  return false
}

module.exports = Search
