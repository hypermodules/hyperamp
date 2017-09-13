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

  createElement (metadata) {
    this.arguments = arguments

    var { title = '--', artist = '--', album = '--' } = metadata

    return html`
      <div class="${styles.meta}">
        ${title || 'No Track Selected'} -
        ${Array.isArray(artist) ? artist.join(', ') : artist || 'No Artist'}
        ${album != null && album !== '' ? ` - ${album}` : null}
      </div>
    `
  }

  update () {
    return compare(arguments, this.arguments)
  }
}

module.exports = Meta
