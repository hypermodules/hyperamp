var html = require('choo/html')
var Component = require('cache-component')
var styles = require('./styles')

class Meta extends Component {
  constructor (opts) {
    if (!opts) opts = {}
    super(opts)
    this._opts = Object.assign({}, opts)
  }

  _render () {
    var key = state.library.trackOrder[this._currentIndex]
    var {
      title = '--',
      artist = '--',
      album = '--'
    } = state.library.trackDict[key] || {}
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

  _update () {

  }
}

module.exports = Meta
