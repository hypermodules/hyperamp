var html = require('choo/html')
var header = require('../../elements/header')
var button = require('../../elements/button')
var formStyles = require('../../elements/form/styles')
var { app, dialog } = require('electron').remote
var styles = require('../styles')

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
      ${header(state, emit)}
      <div class="window-content">
        <div class="${styles.pane}">
          <form class=${formStyles.form}>
            <div class="${formStyles.formGroup}">
                <label>Media Folder:</label>
                <input type="text"
                  class="${formStyles.formControl}"
                  onclick=${showDialog}
                  value="${state.config.music}"
                  readonly="true">
            </div>
          </form>
          ${button({
            onclick: () => emit('location:set', '/'),
            iconName: 'entypo-chevron-left'
          }, 'Back')}
        </div>
      </div>
    </main>
  `
}

module.exports = preferences
