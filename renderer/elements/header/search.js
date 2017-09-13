var html = require('choo/html')
var formStyles = require('../form/styles')
var styles = require('./styles')
var assert = require('assert')
var Component = require('nanocomponent')

class Search extends Component {
  constructor (opts) {
    if (!opts) opts = {}
    super(opts)

    this._opts = Object.assign({ id: '' }, opts)
    this._value = ''
    this._onchange = null
    this._className = `${formStyles.formControl} ${styles.searchInput}`
    this._handleInput = this._handleInput.bind(this)
  }

  _handleInput (ev) {
    if (this._onchange) this._onchange(this.element.value)
  }

  createElement ({ onchange, value, className }) {
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
  update ({value, onchange, className}) {
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
}

module.exports = Search
