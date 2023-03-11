const Component = require('nanocomponent')
const compare = require('nanocomponent/compare')
const Artwork = require('./artwork')
const html = require('choo/html')
const css = require('csjs-inject')

const styles = css`
  .nowPlaying {
    position: relative;
    min-width: 220px;
    max-width: 300px;
    flex: 1 0 30%;
    display: flex;
    align-items: center;
    padding-right: 2%;
    overflow: hidden;
    border-right: var(--border);
    margin-right: 2%;
    height: 100%;
  }

  .meta {
    font-size: 12px;
    text-align: left;
    padding-left: 10px;
    overflow: hidden;
  }
  .title, .artist {
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .title { font-weight: 600 }
`

class Meta extends Component {
  constructor () {
    super()

    // state
    this.arguments = []

    // owned children
    this.artwork = new Artwork()

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.emit('library:recall')
  }

  createElement (track = {}, emit) {
    this.arguments = arguments
    this.emit = emit

    const { title, artist } = track

    return html`
      <div class=${styles.nowPlaying}>
        ${this.artwork.render(track.artwork)}

        <div class=${styles.meta} onclick=${this.handleClick}>
          ${artist != null && artist !== '' && artist.length > 0 /* eslint-disable indent */
            ? html`<div class=${styles.artist}>${Array.isArray(artist) ? artist.join(', ') : artist}</div>`
            : ''/* eslint-enable indent */}
          ${title != null/* eslint-disable indent */
            ? html`<div class=${styles.title}>${title}</div>`
            : html`<div>No Track Selected</div>`/* eslint-enable indent */} 
        </div>
      </div>
    `
  }

  update (_, emit) {
    this.emit = emit
    return compare(arguments, this.arguments)
  }
}

module.exports = Meta
