var { remote } = require('electron')
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

    this.emit = null
    this.search = ''
    this.dialogOpen = false

    this.handleSearch = this.handleSearch.bind(this)
    this.handleAddButton = this.handleAddButton.bind(this)
    this.handlePaths = this.handlePaths.bind(this)
    this.handleNav = this.handleNav.bind(this)
    this.handleDrop = this.handleDrop.bind(this)

    this.searchComp = new Search()
  }

  handleSearch (val) {
    this.search = val
    this.emit('library:search', val)
  }

  handleAddButton () {
    if (!this.dialogOpen) {
      this.dialogOpen = true
      var paths = config.get('paths')
      var defaultPath = paths ? paths[paths.length - 1] : app.getPath('music')
      dialog.showOpenDialog({
        defaultPath: defaultPath,
        properties: ['openFile', 'openDirectory', 'multiSelections']
      },
      this.handlePaths)
    }
  }

  handlePaths (paths) {
    this.dialogOpen = false
    if (paths) {
      this.emit('config:set', { paths: paths })
      this.emit('library:update-library', paths)
    }
  }

  handleNav () {
    this.emit('pushState', '#preferences')
  }

  handleDrop (event) {
    event.preventDefault()
    const { files } = event.dataTransfer
    var paths = Array(files.length).fill(0).map((_, i) => files.item(i).path)
    this.handlePaths(paths)
  }

  createElement (state, emit) {
    this.emit = emit
    this.search = state.library.search
    this.loading = state.library.loading

    // `this._emit` is undefined if this is assigned in the constructor
    document.body.ondrop = this.handleDrop
    document.ondragover = event => event.preventDefault()

    return html`
      <header class="${styles.toolbar}">
        <div class="${styles.leftCluster}">
          ${this.searchComp.render({
            onchange: this.handleSearch,
            value: this.search
          })}
        </div>
        <div class="${styles.rightCluster}">
          <div class="${buttonStyles.btnGroup}">
            ${button({
              className: this.loading ? styles.spin : null,
              onclick: this.handleAddButton,
              iconName: 'entypo-plus'
            })}
          </div>
        </div>
      </header>
    `
  }

  update (state, emit) {
    if (this.search !== state.library.search) return true
    if (this.loading !== state.library.loading) return true
    return false
  }
}

module.exports = Header
