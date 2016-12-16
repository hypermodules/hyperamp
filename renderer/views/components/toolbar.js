const html = require('choo/html')
const css = require('csjs-inject')
const player = require('./player')
const search = require('./search')
const button = require('./button')

const style = css`
  .toolbar {
    -webkit-app-region: drag;
    border-bottom: 1px solid rgba(255, 255, 255, .2);
    height: 40px;
    padding-right: 1em;
    padding-left: 6em;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`

module.exports = (state, prev, send) => html`
  <header class="${style.toolbar}">
    ${player(state.player, send)}
    <div>
      ${search((e) => send('library:search', e.target.value))}
      <a href='/preferences'>
        ${button(null, 'entypo-cog')}
      </a>
    </div>
  </header>
`
