var html = require('choo/html')
var Header = require('../elements/header')
var button = require('../elements/button')
var Player = require('../elements/player')
var player = new Player()
var formStyles = require('../elements/form/styles')
var { app, dialog } = require('electron').remote
var styles = require('./styles')

var header = new Header()

function preferences (state, emit) {
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
    <main class="${styles.window}">
      <div class="${styles.grow}">
        ${header.render(state, emit)}
        <div class="window-content">
          <div class="${styles.pane}">
            <form class=${formStyles.form}>
              <div class="${formStyles.formGroup}">
                  <label>Media Folder:</label>
                  <input type="text"
                    class="${formStyles.formControl}"
                    onclick=${showDialog}
                    value="${state.config.music || ''}"
                    readonly="true">
              </div>
            </form>
            ${button({
              onclick: () => emit('pushState', '#'),
              iconName: 'entypo-chevron-left'
            }, 'Back')}
          </div>
        </div>
      </div>
      ${player.render(state, emit)}
    </main>
  `
}

module.exports = preferences
