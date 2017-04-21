var html = require('choo/html')
var VolumeCluster = require('../volume')
var volume = new VolumeCluster()
var Search = require('../search')
var search = new Search()
var button = require('../button')
var buttonStyles = require('../button/styles')
var { app, dialog } = require('electron').remote
var styles = require('./styles')
var Component = require('cache-component')

window.volumeCluster = volume

function Header () {
  if (!(this instanceof Header)) return new Header()

  this._handleSearch = this._handleSearch.bind(this)
  Component.call(this)
}

Header.prototype = Object.create(Component.prototype)

Header.prototype._handleSearch = function (val) {
  this._emit('library:search', val)
}

Header.prototype._handleAddButton = function () {
  dialog.showOpenDialog({
    defaultPath: app.getPath('home'),
    properties: ['openDirectory']
  },
  this._handlePaths)
}

Header.prototype._handlePaths = function (paths) {
      // paths is undefined if user presses cancel
  if (paths) {
    this.emit('config:set', { music: paths[0] })
    emit('library:loadSongs')
  }
}

Header.prototype._render = function (state, emit) {
  return html`
    <header class="${styles.toolbar}">
      <div class="${styles.leftCluster}">
        ${volume.render(state, emit)}
      </div>
      <div class="${styles.rightCluster}">
        ${search({
          onchange: this._handleSearch,
          value: state.library.search
        })}
        ${addFiles(emit)}
      </div>
    </header>
  `
}

module.exports = (state, emit) => html`
  <header class="${styles.toolbar}">
    <div class="${styles.leftCluster}">
      ${volume.render(state, emit)}
    </div>
    <div class="${styles.rightCluster}">
      ${search.render({
        onchange: (val) => emit('library:search', val),
        value: state.library.search
      })}
      <div class="${buttonStyles.btnGroup}">
        ${addFiles(emit)}
        ${button({
          onclick: () => emit('pushState', '#preferences'),
          iconName: 'entypo-cog'
        })}
      </div>
    </div>
  </header>
`

function addFiles (emit) {
  function showDialog () {
    dialog.showOpenDialog({
      defaultPath: app.getPath('home'),
      properties: ['openDirectory']
    }, (paths) => {
      // paths is undefined if user presses cancel
      if (paths) {
        emit('config:set', { music: paths[0] })
        emit('library:loadSongs')
      }
    })
  }

  return html`
    ${button({
      onclick: showDialog,
      iconName: 'entypo-plus'
    })}
  `
}
