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
        ${button({
          onclick: () => send('player:prev'),
          iconName: 'entypo-controller-fast-backward',
          disabled: true
        })}
        ${button({
          onclick: play,
          iconName: `entypo-controller-${player.playing ? 'paus' : 'play'}`
        })}
        ${button({
          onclick: () => send('player:next'),
          iconName: 'entypo-controller-fast-forward',
          disabled: true
        })}
      </div>
      ${volume({
        value: player.volume,
        oninput: (e) => send('player:volume', { volume: e.target.value })
      })}
    </div>
  `
}
