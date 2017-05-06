var { app, dialog } = require('electron').remote
var html = require('choo/html')
var Component = require('cache-component')
var Search = require('../search')
var button = require('../button')
var config = require('electron').remote.require('./config.js')
var buttonStyles = require('../button/styles')
var styles = require('./styles')

function Header (opts) {
  if (!(this instanceof Header)) return new Header()
  this._emit = null
  this._search = ''
  this._dialogOpen = false

  this._handleSearch = this._handleSearch.bind(this)
  this._handleAddButton = this._handleAddButton.bind(this)
  this._handlePaths = this._handlePaths.bind(this)
  this._handleNav = this._handleNav.bind(this)

  this._searchComp = new Search()
  Component.call(this)
}
Header.prototype = Object.create(Component.prototype)

Header.prototype._handleSearch = function (val) {
  this._search = val
  this._emit('library:search', val)
}

Header.prototype._handleAddButton = function () {
  if (!this._dialogOpen) {
    this._dialogOpen = true
    var paths = config.get('paths')
    var defaultPath = paths[paths.length - 1] || app.getPath('music')
    dialog.showOpenDialog({
      defaultPath: defaultPath,
      properties: ['openFile', 'openDirectory', 'multiSelections']
    },
    this._handlePaths)
  }
}

Header.prototype._handlePaths = function (paths) {
  this._dialogOpen = false
  if (paths) {
    this._emit('config:set', { paths: paths })
    this._emit('library:update-library', paths)
  }
}

Header.prototype._handleNav = function () {
  this._emit('pushState', '#preferences')
}

Header.prototype._render = function (state, emit) {
  this._emit = emit
  this._search = state.library.search
  return html`
    <header class="${styles.toolbar}">
      <div class="${styles.leftCluster}">
        ${this._searchComp.render({
          onchange: this._handleSearch,
          value: this._search
        })}
      </div>
      <div class="${styles.rightCluster}">
        <div class="${buttonStyles.btnGroup}">
          ${button({
            onclick: this._handleAddButton,
            iconName: 'entypo-plus'
          })}
          ${button({
            onclick: this._handleNav,
            iconName: 'entypo-cog'
          })}
        </div>
      </div>
    </header>
  `
}

Header.prototype._update = function (state, emit) {
  if (this._search !== state.library.search) return true
  return false
}

module.exports = Header
