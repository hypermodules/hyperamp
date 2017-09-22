var { remote } = require('electron')
var { app, dialog } = remote
var html = require('choo/html')
var Component = require('nanocomponent')
var button = require('./button')
var config = remote.require('./config.js')
var buttonStyles = require('./button/styles')
var css = require('csjs-inject')

var styles = css`
  .add {
    font-size: 1.5em;
  }
  .spin { animation: ckw 4s infinite linear }

  @keyframes ckw {
    0% { transform: rotate(0deg) }
    100% { transform: rotate(360deg) }
  }
`

class Add extends Component {
  constructor (opts) {
    super(opts)

    this._emit = null
    this._dialogOpen = false

    this._handleAddButton = this._handleAddButton.bind(this)
    this._handlePaths = this._handlePaths.bind(this)
    this._handleDrop = this._handleDrop.bind(this)
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

  _handleDrop (event) {
    event.preventDefault()
    const { files } = event.dataTransfer
    var paths = Array(files.length).fill(0).map((_, i) => files.item(i).path)
    this._handlePaths(paths)
  }

  createElement (state, emit) {
    this._emit = emit
    this._loading = state.library.loading

    // `this._emit` is undefined if this is assigned in the constructor
    document.body.ondrop = this._handleDrop
    document.ondragover = event => event.preventDefault()

    return html`
      <div class="${buttonStyles.btnGroup} ${styles.add}">
        ${button({
          className: this._loading ? styles.spin : null,
          onclick: this._handleAddButton,
          iconName: 'entypo-folder-music'
        })}
      </div>
    `
  }

  update (state, emit) {
    if (this._loading !== state.library.loading) return true
    return false
  }
}

module.exports = Add
