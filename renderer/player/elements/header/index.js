const remote = require('@electron/remote')
const { app, dialog } = remote
const html = require('choo/html')
const Component = require('nanocomponent')
const Search = require('./search')
const button = require('../button')
const config = remote.require('./config.js')
const css = require('csjs-inject')

const styles = css`
  .toolbar {
    -webkit-app-region: drag;
    height: 40px;
    padding: 0 .5em 0 6.5em;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .toolbarLeft, .toolbarRight {
    display: flex;
    align-items: center;
  }
  .toolbarLeft { flex: 1 }
  .toolbarRight {
    font-size: 1.5em;
    margin-left: auto;
  }

  @keyframes ckw {
    0% { transform: rotate(0deg) }
    100% { transform: rotate(360deg) }
  }

  .spin { animation: ckw 4s infinite linear }
`

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
      const paths = config.get('paths')
      const defaultPath = paths ? paths[paths.length - 1] : app.getPath('music')
      dialog.showOpenDialog({
        defaultPath,
        properties: ['openFile', 'openDirectory', 'multiSelections']
      })
        .then(this.handlePaths)
        .catch(err => {
          this.dialogOpen = false
          console.error(err)
        })
    }
  }

  handlePaths ({ filePaths }) {
    this.dialogOpen = false
    if (filePaths) {
      this.emit('config:set', { filePaths })
      this.emit('library:update-library', filePaths)
    }
  }

  handleNav () {
    this.emit('pushState', '#preferences')
  }

  handleDrop (event) {
    event.preventDefault()
    const { files } = event.dataTransfer
    const paths = Array(files.length).fill(0).map((_, i) => files.item(i).path)
    this.handlePaths({ filePaths: paths })
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
        <div class="${styles.toolbarLeft}">
          ${this.searchComp.render({ /* eslint-disable indent */
            onchange: this.handleSearch,
            value: this.search
          })/* eslint-enable indent */}
        </div>
        <div class="${styles.toolbarRight}">
          ${button({ /* eslint-disable indent */
            className: this.loading ? styles.spin : null,
            onclick: this.handleAddButton,
            iconName: this.loading ? 'entypo-cog' : 'entypo-folder-music'
          })/* eslint-enable indent */}
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
