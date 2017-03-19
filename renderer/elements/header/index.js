var html = require('choo/html')
var volume = require('../volume')
var search = require('../search')
var button = require('../button')
var { app, dialog } = require('electron').remote
var styles = require('./styles')

module.exports = (state, emit) => html`
  <header class="${styles.toolbar}">
    <div class="${styles.leftCluster}">
      ${volume(state, emit)}
    </div>
    <div class="${styles.rightCluster}">
      ${search({ oninput: (e) => emit('library:search', e.target.value) })}
      ${addFiles(emit)}
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
