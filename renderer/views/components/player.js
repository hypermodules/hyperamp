const html = require('choo/html')
const css = require('csjs-inject')
const button = require('./button')
const volume = require('./volume')

const style = css`
  .player {
    display: flex;
    align-items: center;
  }
`

module.exports = (player, send) => {
  function play () {
    if (player.playing) return send('player:pause')
    send('player:play')
  }

  return html`
    <div class="${style.player}">
      <div class="${button.style.btnGroup}">
        ${button(() => send('player:prev'), 'entypo-controller-fast-backward', true)}
        ${button(play, `entypo-controller-${player.playing ? 'paus' : 'play'}`)}
        ${button(() => send('player:next'), 'entypo-controller-fast-forward', true)}
      </div>
      ${volume(player.volume, (e) => send('player:volume', { volume: e.target.value }))}
    </div>
  `
}
