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

    this._emit = null
    this._search = ''

    this._handleSearch = this._handleSearch.bind(this)
    this._handleNav = this._handleNav.bind(this)

    this._searchComp = new Search()
  }

  _handleSearch (val) {
    this._search = val
    this._emit('library:search', val)
  }

  _handleNav () {
    this._emit('pushState', '#preferences')
  }

  createElement (state, emit) {
    this._emit = emit
    this._search = state.library.search

    return html`
      <header class="${styles.toolbar}">
        ${this._searchComp.render({
          onchange: this._handleSearch,
          value: this._search
        })}
      </header>
    `
  }

  update (state, emit) {
    if (this._search !== state.library.search) return true
    return false
  }
}

module.exports = Header
