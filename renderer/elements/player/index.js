var html = require('choo/html')
var Component = require('nanocomponent')
var Add = require('../add')
var Controls = require('./controls')
var Progress = require('./progress')
var Volume = require('./volume')
var Meta = require('./meta')
var css = require('csjs-inject')

var styles = css`
  .player {
    -webkit-app-region: drag;
    align-items: center;
    text-align: center;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 38px;
    justify-content: space-between;
    will-change: transform;
    contain: layout;
    display: flex;
    padding: 0;
    background: var(--bg);
  }
  .audioControls {
    padding: 0 1% 0 6em;
    display: flex;
    justify-content: space-between;
    contain: layout;
    width: 100%;
  }
`

class Player extends Component {
  constructor (opts) {
    if (!opts) opts = {}
    super(opts)
    this.opts = Object.assign({}, opts)

    // state
    this.emit = null
    this.key = null
    this.pictureHash = null

    // owned children
    this.add = new Add()
    this.controls = new Controls()
    this.progress = new Progress()
    this.volume = new Volume()
    this.meta = new Meta()
  }

  createElement (state, emit) {
    var { currentTrack = {} } = state.player

    this.emit = emit
    this.key = currentTrack.key

    // ${this.meta.render(currentTrack)}

    return html`
      <div class="${styles.player}">
        <div class="${styles.audioControls}">
          ${this.controls.render(state, emit)}
          ${this.progress.render(state, emit)}
          ${this.volume.render(state, emit)}
          ${this.add.render(state, emit)}
        </div>
      </div>
    `
  }

  update (state, emit) {
    this.emit = emit

    var { currentTrack = {} } = state.player

    if (this.key !== currentTrack.key) return true

    this.add.render(state, emit)
    this.controls.render(state, emit)
    this.progress.render(state, emit)
    this.volume.render(state, emit)
    this.meta.render(currentTrack)

    return false
  }
}

module.exports = Player
