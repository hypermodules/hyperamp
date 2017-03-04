var html = require('choo/html')
var player = require('../player')
var search = require('../search')
var button = require('../button')
var { app, dialog } = require('electron').remote
var styles = require('./styles')

module.exports = (state, prev, send) => html`
  <header class="${styles.toolbar}">
    ${player(state.player, send)}
    <div class="${styles.rightCluster}">
      ${search({ oninput: (e) => send('library:search', e.target.value) })}
      ${addFiles(send)}
    </div>
  </header>
`

function addFiles (send) {
  function showDialog () {
    dialog.showOpenDialog({
      defaultPath: app.getPath('home'),
      properties: ['openDirectory']
    }, (paths) => {
      // paths is undefined if user presses cancel
      if (paths) {
        send('config:set', { music: paths[0] })
        send('library:loadSongs')
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
