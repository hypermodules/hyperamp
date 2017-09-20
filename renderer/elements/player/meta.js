var Component = require('nanocomponent')
var compare = require('nanocomponent/compare')
var Artwork = require('./artwork')
var html = require('choo/html')
var css = require('csjs-inject')

var styles = css`
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
    padding-left: 1.5em;
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
    this._artwork = new Artwork()
  }

  createElement (track, artwork) {
    this.arguments = arguments

    var { title, artist } = track

    return html`
      <div class=${styles.nowPlaying}>
        ${this._artwork.render(artwork)}

        <div class=${styles.meta}>
          ${artist != null && artist !== '' && artist.length > 0
            ? html`<div class=${styles.artist}>${Array.isArray(artist) ? artist.join(', ') : artist}</div>`
            : ''}
          ${title != null
            ? html`<div class=${styles.title}>${title}</div>`
            : html`<div>No Track Selected</div>`}
        </div>
      </div>
    `
  }

  update () {
    return compare(arguments, this.arguments)
  }
}

module.exports = Meta
