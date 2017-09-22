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
    font-size: 1.25em;
  }
  .spin { animation: ckw 4s infinite linear }

  @keyframes ckw {
    0% { transform: rotate(0deg) }
    100% { transform: rotate(-360deg) }
  }
`

class Add extends Component {
  constructor (opts) {
    super(opts)

    this.emit = null
    this.dialogOpen = false

    this.handleAddButton = this.handleAddButton.bind(this)
    this.handlePaths = this.handlePaths.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
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

  handleDrop (event) {
    event.preventDefault()
    const { files } = event.dataTransfer
    var paths = Array(files.length).fill(0).map((_, i) => files.item(i).path)
    this.handlePaths(paths)
  }

  createElement (state, emit) {
    this.emit = emit
    this.loading = state.library.loading

    // `this.emit` is undefined if this is assigned in the constructor
    document.body.ondrop = this.handleDrop
    document.ondragover = event => event.preventDefault()

    return html`
      <div class="${buttonStyles.btnGroup} ${styles.add}">
        ${button({
          className: this.loading ? styles.spin : null,
          onclick: this.handleAddButton,
          iconName: this.loading ? 'entypo-cycle' : 'entypo-folder-music'
        })}
      </div>
    `
  }

  update (state, emit) {
    if (this.loading !== state.library.loading) return true
    return false
  }
}

module.exports = Add
