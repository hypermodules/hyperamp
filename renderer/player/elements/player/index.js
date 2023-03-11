const html = require('choo/html')
const Component = require('nanocomponent')
const Controls = require('./controls')
const Progress = require('./progress')
const Volume = require('./volume')
const Meta = require('./meta')
const css = require('csjs-inject')

const styles = css`
  .player {
    -webkit-app-region: drag;
    border-top: var(--border);
    align-items: center;
    text-align: center;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 77px;
    justify-content: space-between;
    will-change: transform;
    contain: layout;
    display: flex;
    padding: 0 2% 0 0;
    background: var(--bg);
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
    this.controls = new Controls()
    this.progress = new Progress()
    this.volume = new Volume()
    this.meta = new Meta()
  }

  createElement (state, emit) {
    const { currentTrack = {} } = state.player

    this.emit = emit
    this.key = currentTrack.key

    return html`
      <div class="${styles.player}">
        ${this.meta.render(currentTrack, emit)}
        ${this.controls.render(state, emit)}
        ${this.progress.render(state, emit)}
        ${this.volume.render(state, emit)}
      </div>
    `
  }

  update (state, emit) {
    this.emit = emit

    const { currentTrack = {} } = state.player

    if (this.key !== currentTrack.key) return true

    this.controls.render(state, emit)
    this.progress.render(state, emit)
    this.volume.render(state, emit)
    this.meta.render(currentTrack, emit)

    return false
  }
}

module.exports = Player
