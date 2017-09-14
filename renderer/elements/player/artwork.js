var html = require('choo/html')
var Component = require('nanocomponent')
var fileUrlFromPath = require('file-url')
var path = require('path')
var defaultBG = path.resolve(__dirname, '../../../static/splash.jpg')
var compare = require('nanocomponent/compare')
var css = require('csjs-inject')

var styles = css`
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

    background: #eee;
    background-size: cover;
    background-position: center;
  }
`

class Artwork extends Component {
  constructor (opts) {
    if (!opts) opts = {}
    super(opts)
    this._opts = Object.assign({}, opts)

    this.arguments = []
  }

  createElement (artworkPath) {
    this.arguments = arguments

    var fileUrl = fileUrlFromPath(artworkPath || defaultBG)
    var style = fileUrl
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
