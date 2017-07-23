var html = require('choo/html')
var Component = require('nanocomponent')
var compare = require('nanocomponent/compare')
var styles = require('./styles')

class Meta extends Component {
  constructor (opts) {
    if (!opts) opts = {}
    super(opts)
    this._opts = Object.assign({}, opts)

    this._title = null
    this._artist = null
    this._album = null
  }

  createElement (title, artist, album) {
    this._title = title || '--'
    this._artist = artist || '--'
    this._album = album || '--'

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
    return compare(arguments, this.lastArgs)
  }
}

module.exports = Meta
