var html = require('choo/html')
var Component = require('nanocomponent')
var styles = require('./styles')
var fileUrlFromPath = require('file-url')
var path = require('path')
var defaultBG = path.resolve(__dirname, '../../../static/splash.jpg')
var compare = require('nanocomponent/compare')

class Artwork extends Component {
  constructor (opts) {
    if (!opts) opts = {}
    super()
    this._opts = Object.assign({}, opts)

    this.arguments = []
  }

  createElement (artworkPath) {
    var fileUrl = fileUrlFromPath(artworkPath || defaultBG)
    this.arguments = arguments
    return html`
      <div class="${styles.albumCover}">
        <div class="${styles.albumArt}" style="background-image: ${fileUrl ? 'url(' + fileUrl + ')' : ''}"></div>
      </div>
    `
  }

  update () {
    return compare(arguments, this.arguments)
  }
}

module.exports = Artwork
