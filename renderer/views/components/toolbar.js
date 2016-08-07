const html = require('choo/html')

module.exports = (state, prev, send) => html`
  <header class="toolbar toolbar-header">
    <h1 class="title"><span class="icon icon-note-beamed"></span> ${state.title}</h1>

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
        <a href="preferences" class="btn btn-default">
          <span class="icon icon-cog"/>
        </a>
      </span>
    </div>
  </header>
`
