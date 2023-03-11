const html = require('choo/html')
const formStyles = require('../form/styles')
const assert = require('assert')
const Component = require('nanocomponent')
const css = require('csjs-inject')

const styles = css`
  .searchInput {
    -webkit-app-region: no-drag;
    width: 100%;
    padding: 1px 5px;
    vertical-align: middle;
    min-height: auto;
    margin-right: 1em;
    height: 24px;
  }
`

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
    assert.strict.equal(typeof onchange, 'function', 'Search: onchange should be a function')

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
  update ({ value, onchange, className }) {
    assert.strict.equal(typeof onchange, 'function', 'Range: onchange should be a function')
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
