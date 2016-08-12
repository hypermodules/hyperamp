const html = require('choo/html')
const title = require('./title')
const player = require('./player')
const search = require('./search')

module.exports = (state, prev, send) => html`
  <header class="toolbar toolbar-header">
    ${title()}

    <div class="toolbar-actions">
      ${player(state.player, send)}

      <span class="pull-right">
        ${search(send)}
        <a href="/preferences" class="btn btn-default">
          <span class="icon icon-cog"/>
        </a>
      </span>
    </div>
  </header>
`
