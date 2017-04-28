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

function Header (opts) {
  if (!(this instanceof Header)) return new Header()
  this._emit = null

  this._handleSearch = this._handleSearch.bind(this)
  this._handleAddButton = this._handleAddButton.bind(this)
  this._handlePaths = this._handlePaths.bind(this)
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
    this._emit('config:set', { music: paths[0] })
    this._emit('library:loadSongs')
  }
}

Header.prototype._render = function (state, emit) {
  console.log('render')
  this._emit = emit
  return html`
    <header class="${styles.toolbar}">
      <div class="${styles.leftCluster}">
        ${volume.render(state, emit)}
      </div>
      <div class="${styles.rightCluster}">
        ${search.render({
          onchange: this._handleSearch,
          value: state.library.search
        })}
        <div class="${buttonStyles.btnGroup}">
          ${button({
            onclick: this._handleAddButton,
            iconName: 'entypo-plus'
          })}
          ${button({
            onclick: () => emit('pushState', '#preferences'),
            iconName: 'entypo-cog'
          })}
        </div>
      </div>
    </header>
  `
}

Header.prototype._update = function (state, emit) {
  // TODO improve this
  return true
}

Header.prototype._unload = function () {
  console.log('unload')
}

Header.prototype._load = function () {
  console.log('load')
}

module.exports = Header
