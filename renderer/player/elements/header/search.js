var html = require('choo/html')
var formStyles = require('../form/styles')
var styles = require('./styles')
var assert = require('assert')
var Component = require('nanocomponent')

class Search extends Component {
  constructor (opts) {
    if (!opts) opts = {}
    super(opts)

    this.opts = Object.assign({ id: '' }, opts)
    this.value = ''
    this.onchange = null
    this.className = `${formStyles.formControl} ${styles.searchInput}`
    this.handleInput = this.handleInput.bind(this)
  }

  handleInput (ev) {
    if (this.onchange) this.onchange(this.element.value)
  }

  createElement ({ onchange, value, className }) {
    assert.equal(typeof onchange, 'function', 'Search: onchange should be a function')

    this.onchange = onchange
    this.value = value
    if (className !== undefined) this.className = className

    return html`
      <input type='search'
        class='${this.className ? this.className : ''}'
        placeholder='Search'
        value='${this.value}'
        oninput=${this.handleInput}>
    `
  }

  // Lets mutate!
  update ({value, onchange, className}) {
    assert.equal(typeof onchange, 'function', 'Range: onchange should be a function')
    if (this.onchange !== onchange) {
      this.onchange = onchange
    }
    if (this.className !== className) {
      this.className = className
      this.element.class = className
    }
    if (this.element.value !== value) {
      // Mutate value changes

      this.value = value
      this.element.value = this.value
    }
    return false
  }
}

module.exports = Search
