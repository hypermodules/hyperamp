// NOTE: this page is not currently in use

const html = require('choo/html')
const Header = require('../elements/header')
const button = require('../elements/button')
const Player = require('../elements/player')
const player = new Player()
const formStyles = require('../elements/form/styles')
const remote = require('@electron/remote')
const { app, dialog } = remote
const styles = require('./styles')

const header = new Header()

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
            ${button({ /* eslint-disable indent */
              onclick: () => emit('pushState', '#'),
              iconName: 'entypo-chevron-left'
            }, 'Back')/* eslint-disable indent */}
          </div>
        </div>
      </div>
      ${player.render(state, emit)}
    </main>
  `
}

module.exports = preferences
