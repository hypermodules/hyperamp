var html = require('choo/html')
var Search = require('../search')
var button = require('../button')
var config = require('electron').remote.require('./config.js')
var buttonStyles = require('../button/styles')
var { app, dialog } = require('electron').remote
var styles = require('./styles')
var Component = require('cache-component')

function Header (opts) {
  if (!(this instanceof Header)) return new Header()
  this._emit = null
  this._searchString = ''

  this._handleSearch = this._handleSearch.bind(this)
  this._handleAddButton = this._handleAddButton.bind(this)
  this._handlePaths = this._handlePaths.bind(this)

  this._search = new Search()
  Component.call(this)
}

Header.prototype = Object.create(Component.prototype)

Header.prototype._handleSearch = function (val) {
  this._emit('library:search', val)
}

Header.prototype._handleAddButton = function () {
  var paths = config.get('paths')
  var defaultPath = paths[paths.length - 1] || app.getPath('music')
  dialog.showOpenDialog({
    defaultPath: defaultPath,
    properties: ['multiSelections']
  },
  this._handlePaths)
}

Header.prototype._handlePaths = function (paths) {
  if (paths) {
    this._emit('config:set', { paths: paths })
    this._emit('library:update-library', paths)
  }
}

Header.prototype._render = function (state, emit) {
  this._emit = emit
  this._searchString = state.library.search
  return html`
    <header class="${styles.toolbar}">
      <div class="${styles.leftCluster}">
        ${this._search.render({
          onchange: this._handleSearch,
          value: this._searchString
        })}
      </div>
      <div class="${styles.rightCluster}">
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
  if (this._searchString !== state.library.search) return true
  return false
}

module.exports = Header
