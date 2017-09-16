var remote = require('electron').remote
var { app, dialog } = remote
var html = require('choo/html')
var Component = require('nanocomponent')
var Search = require('./search')
var button = require('../button')
var config = remote.require('./config.js')
var buttonStyles = require('../button/styles')
var styles = require('./styles')

class Header extends Component {
  constructor (opts) {
    super(opts)

    this._emit = null
    this._search = ''
    this._dialogOpen = false

    this._handleSearch = this._handleSearch.bind(this)
    this._handleAddButton = this._handleAddButton.bind(this)
    this._handlePaths = this._handlePaths.bind(this)
    this._handleNav = this._handleNav.bind(this)
    this._handleDrop = this._handleDrop.bind(this)

    this._searchComp = new Search()
  }

  _handleSearch (val) {
    this._search = val
    this._emit('library:search', val)
  }

  _handleAddButton () {
    if (!this._dialogOpen) {
      this._dialogOpen = true
      var paths = config.get('paths')
      var defaultPath = paths ? paths[paths.length - 1] : app.getPath('music')
      dialog.showOpenDialog({
        defaultPath: defaultPath,
        properties: ['openFile', 'openDirectory', 'multiSelections']
      },
      this._handlePaths)
    }
  }

  _handlePaths (paths) {
    this._dialogOpen = false
    if (paths) {
      this._emit('config:set', { paths: paths })
      this._emit('library:update-library', paths)
    }
  }

  _handleNav () {
    this._emit('pushState', '#preferences')
  }

  _handleDrop (event) {
    event.preventDefault()
    const { files } = event.dataTransfer
    var paths = Array(files.length).fill(0).map((_, i) => files.item(i).path)
    this._handlePaths(paths)
  }

  createElement (state, emit) {
    this._emit = emit
    this._search = state.library.search
    this._loading = state.library.loading

    // `this._emit` is undefined if this is assigned in the constructor
    document.body.ondrop = this._handleDrop
    document.ondragover = event => event.preventDefault()

    return html`
      <header class="${styles.toolbar}">
        <div class="${styles.leftCluster}">
          ${this._searchComp.render({
            onchange: this._handleSearch,
            value: this._search
          })}
        </div>
        <div class="${styles.rightCluster}">
          <div class="${buttonStyles.btnGroup}">
            ${button({
              className: this._loading ? styles.spin : null,
              onclick: this._handleAddButton,
              iconName: 'entypo-plus'
            })}
          </div>
        </div>
      </header>
    `
  }

  update (state, emit) {
    if (this._search !== state.library.search) return true
    if (this._loading !== state.library.loading) return true
    return false
  }
}

module.exports = Header
