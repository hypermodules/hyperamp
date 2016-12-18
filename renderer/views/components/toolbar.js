const html = require('choo/html')
const css = require('csjs-inject')
const player = require('./player')
const search = require('./search')
const button = require('./button')

const style = css`
  .toolbar {
    -webkit-app-region: drag;
    border-bottom: var(--border);
    height: 40px;
    padding-right: 1em;
    padding-left: 6em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
  }

  .rightCluster {
    display: flex;
    align-items: center;
  }
`

module.exports = (state, prev, send) => html`
  <header class="${style.toolbar}">
    ${player(state.player, send)}
    <div class="${style.rightCluster}">
      ${search((e) => send('library:search', e.target.value))}
      <a href='/preferences'>
        ${button(null, 'entypo-cog')}
      </a>
    </div>
  </header>
`
