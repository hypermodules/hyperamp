var html = require('choo/html')
var Component = require('nanocomponent')
var Search = require('./search')
var css = require('csjs-inject')

var styles = css`
  .toolbar {
    -webkit-app-region: drag;
    padding: 0 1em;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`

class Header extends Component {
  constructor (opts) {
    super(opts)

    this.emit = null
    this.searchTerm = ''

    this.handleSearch = this.handleSearch.bind(this)
    this.handleNav = this.handleNav.bind(this)

    this.search = new Search()
  }

  handleSearch (val) {
    this.searchTerm = val
    this.emit('library:search', val)
  }

  handleNav () {
    this.emit('pushState', '#preferences')
  }

  createElement (state, emit) {
    this.emit = emit
    this.searchTerm = state.library.search

    return html`
      <header class="${styles.toolbar}">
        ${this.search.render({
          onchange: this.handleSearch,
          value: this.searchTerm
        })}
      </header>
    `
  }

  update (state, emit) {
    if (this.searchTerm !== state.library.search) return true
    return false
  }
}

module.exports = Header
