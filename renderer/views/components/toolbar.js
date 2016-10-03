const html = require('choo/html')
const css = require('sheetify')
const player = require('./player')
const search = require('./search')

const style = css`
  :host {
    -webkit-app-region: drag;
    min-height: 22px;
    box-shadow: inset 0 1px 0 #f5f4f5;
    background: linear-gradient(#e8e6e8, #d1cfd1);
    border-bottom: 1px solid var(--dark-border-color);
    display: flex;
    justify-content: space-between;
    padding-top: 1.7em;
    padding-right: 0.5em;
    padding-left: 0.5em;
    padding-bottom: 0.4em;
  }
`

module.exports = (state, prev, send) => html`
  <header class="toolbar toolbar-header ${style}">
    ${player(state.player, send)}
    <div>
      ${search(send)}
      <a href="/preferences" class="btn btn-default">
        <button></button>
      </a>
    </div>
  </header>
`
