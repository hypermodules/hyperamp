const html = require('choo/html')
const title = require('./components/title')
const fcStyle = require('./components/form-control').style
const { app, dialog } = require('electron').remote

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
    <main class="window preferences">
      <header class="toolbar toolbar-header">${title()}</header>
      <div class="window-content">
        <div class="pane-group">
          <div class="pane">
            <form>
              <div class="form-group">
                  <label>Library Folder Path</label>
                  <input type="text"
                    class="${fcStyle['form-control']}"
                    onclick=${showDialog}
                    value="${state.config.music}">
              </div>
            </form>
          </div>
        </div>
      </div>
      <footer class="toolbar toolbar-footer">
        <div class="toolbar-actions">
          <a href="/" class="btn btn-default">Back</a>
        </div>
      </footer>
    </main>
  `
}

module.exports = preferences
