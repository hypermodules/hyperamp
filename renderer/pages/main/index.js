var html = require('choo/html')
var Header = require('../../elements/header')
var Playlist = require('../../elements/playlist')
var Player = require('../../elements/player')

var styles = require('../styles')

module.exports = main

var header = new Header()
var playlist = new Playlist()
var player = new Player()

// TODO set up view instance factory
function main (state, emit) {
  return html`
    <main class="${styles.window}">
      <div class="${styles.grow}">
        ${header.render(state, emit)}
        ${playlist.render(state, emit)}
      </div>
      ${player.render(state, emit)}
    </main>
  `
}
