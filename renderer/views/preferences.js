const html = require('choo/html')
const toolbar = require('./components/toolbar')
const button = require('./components/button')
const fcStyle = require('./components/form-control').style
const { app, dialog } = require('electron').remote
const styles = require('./styles')

function preferences (state, prev, send) {
  function showDialog () {
    dialog.showOpenDialog({
      defaultPath: app.getPath('home'),
      properties: ['openDirectory']
    }, (paths) => {
      // paths is undefined if user presses cancel
      if (paths) send('config:set', { music: paths[0] })
    })
  }

  return html`
    <main class="${styles.window}">
      ${toolbar(state, prev, send)}
      <div class="window-content">
        <div class="${styles.pane}">
          <form class=${fcStyle.form}>
            <div class="${fcStyle.formGroup}">
                <label>Media Folder:</label>
                <input type="text"
                  class="${fcStyle.formControl}"
                  onclick=${showDialog}
                  value="${state.config.music}"
                  readonly="true">
            </div>
          </form>
          ${button({
            onclick: () => send('location:set', '/'),
            iconName: 'entypo-chevron-left'
          }, 'Back')}
        </div>
      </div>
    </main>
  `
}

module.exports = preferences
