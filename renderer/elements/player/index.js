var html = require('choo/html')
var button = require('../button')
var volume = require('../volume')
var styles = require('./styles')

function player (state, send) {
  return html`
    <div class="${styles.player}">
      <div class="${button.style.btnGroup}">
        ${button({
          onclick: () => send('player:prev'),
          iconName: 'entypo-controller-fast-backward',
          disabled: true
        })}
        ${button({
          onclick: () => play(state, send),
          iconName: `entypo-controller-${state.playing ? 'paus' : 'play'}`
        })}
        ${button({
          onclick: () => send('player:next'),
          iconName: 'entypo-controller-fast-forward',
          disabled: true
        })}
      </div>
      ${volume({
        value: state.volume,
        oninput: (e) => send('player:volume', { volume: e.target.value })
      })}
    </div>
  `
}

function play (state, send) {
  if (state.playing) return send('player:pause')
  send('player:play')
}

module.exports = player
