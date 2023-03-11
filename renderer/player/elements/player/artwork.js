const html = require('choo/html')
const Component = require('nanocomponent')
const fileUrlFromPath = require('file-url')
const path = require('path')
const defaultBG = path.resolve(window.__dirname, 'default-artwork.png')
const compare = require('nanocomponent/compare')
const css = require('csjs-inject')

const styles = css`
  .albumCover {
    position: relative;
    width: 76px;
    height: 76px;
    overflow: hidden;
    float: left;
    flex-shrink: 0;
  }
  .albumCover:before {
    content: '';
    display: block;
    padding-top: 100%; /* initial ratio of 1:1*/
  }
  .albumArt {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    background: var(--bg);
    background-size: cover;
    background-position: center;
  }
`

class Artwork extends Component {
  constructor () {
    super()
    this.arguments = []
  }

  createElement (artworkPath) {
    this.arguments = arguments

    const fileUrl = fileUrlFromPath(artworkPath || defaultBG)
    const style = fileUrl
      ? `background-image: url(${fileUrl})`
      : ''

    return html`
      <div class="${styles.albumCover}">
        <div class="${styles.albumArt}" style=${style}></div>
      </div>
    `
  }

  update () {
    return compare(arguments, this.arguments)
  }
}

module.exports = Artwork
