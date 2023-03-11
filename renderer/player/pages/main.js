const html = require('choo/html')
const Playlist = require('../elements/playlist')
const Player = require('../elements/player')
const css = require('csjs-inject')

const styles = css`
  .window {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
`

const playlist = new Playlist()
const player = new Player()

function main (state, emit) {
  return html`
    <main class="${styles.window}">
      ${playlist.render(state, emit)}
      ${player.render(state, emit)}
    </main>
  `
}

module.exports = main
module.exports.playlist = playlist
