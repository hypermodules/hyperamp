var html = require('choo/html')
var Header = require('../elements/header')
var button = require('../elements/button')
var Player = require('../elements/player')
var player = new Player()
var formStyles = require('../elements/form/styles')
var { app, dialog } = require('electron').remote
var css = require('csjs-inject')

var styles = css`
  .window {
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .pane {
    padding: 1rem;
  }

  .grow {
    flex: 1 0;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 460px) {
    .grow { display: none }
  }
`

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
