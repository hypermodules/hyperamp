var html = require('choo/html')
var Playlist = require('../elements/playlist')
var Player = require('../elements/player')
var css = require('csjs-inject')

var styles = css`
  .window {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
`

var playlist = new Playlist()
var player = new Player()

function main (state, emit) {
  return html`
    <main class="${styles.window}">
      ${playlist.render(state, emit)}
      ${player.render(state, emit)}
    </main>
  `
}

module.exports = main
