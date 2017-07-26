var html = require('choo/html')
var Component = require('nanocomponent')
var compare = require('nanocomponent/compare')
var styles = require('./styles')

class Meta extends Component {
  constructor (opts) {
    if (!opts) opts = {}
    super(opts)
    this._opts = Object.assign({}, opts)

    this.arguments = []
  }

  createElement (title, artist, album) {
    this.arguments = arguments

    return html`
      <div class="${styles.meta}">
        <p class="${styles.title}">${title || 'No Track Selected'}</p>
        <p class="${styles.artist}">
          ${Array.isArray(artist) ? artist.join(', ') : artist || 'No Artist'}
          ${album != null && album !== '' ? ` - ${album}` : null}
        </p>
      </div>
    `
  }

  update () {
    return compare(arguments, this.arguments)
  }
}

module.exports = Meta
