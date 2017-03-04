var html = require('choo/html')
var css = require('csjs-inject')
var player = require('./player')
var search = require('./search')
var button = require('./button')
var { app, dialog } = require('electron').remote

var style = css`
  .toolbar {
    -webkit-app-region: drag;
    border-bottom: var(--border);
    height: 40px;
    padding-right: 1em;
    padding-left: 6em;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .rightCluster {
    display: flex;
    align-items: center;
  }
`

module.exports = (state, prev, send) => html`
  <header class="${style.toolbar}">
    ${player(state.player, send)}
    <div class="${style.rightCluster}">
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
