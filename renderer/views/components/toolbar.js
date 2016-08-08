const html = require('choo/html')
const title = require('./title')

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

      <span class="pull-right">
        <input type="range" min="0" max="100" value="100">
        <a href="/preferences" class="btn btn-default">
          <span class="icon icon-cog"/>
        </a>
      </span>
    </div>
  </header>
`
