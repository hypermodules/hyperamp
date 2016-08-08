const html = require('choo/html')
const title = require('./title')
const volume = require('./volume')

module.exports = (state, prev, send) => html`
  <header class="toolbar toolbar-header">
    ${title()}

    <div class="toolbar-actions">
      <div class="btn-group">
        <button class="btn btn-default">
          <span class="icon icon-fast-backward"></span>
        </button>
        <button class="btn btn-default">
          <span class="icon icon-play"></span>
        </button>
        <button class="btn btn-default">
          <span class="icon icon-fast-forward"></span>
        </button>
      </div>

      ${volume(state.player.volume, send)}

      <span class="pull-right">
        <a href="/preferences" class="btn btn-default">
          <span class="icon icon-cog"/>
        </a>
      </span>
    </div>
  </header>
`
