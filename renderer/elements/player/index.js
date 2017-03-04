var html = require('choo/html')
var button = require('../button')
var buttonStyles = require('../button/styles')
var volume = require('../volume')
var styles = require('./styles')

function player (state, send) {
  return html`
    <div class="${styles.player}">
      <div class="${buttonStyles.btnGroup}">
        ${button({
          onclick: () => send('player:prev'),
          iconName: 'entypo-controller-fast-backward'
        })}
        ${button({
          onclick: () => play(state, send),
          iconName: `entypo-controller-${state.playing ? 'paus' : 'play'}`
        })}
        ${button({
          onclick: () => send('player:next'),
          iconName: 'entypo-controller-fast-forward'
        })}
      </div>
      ${volume(state, send)}
    </div>
  `
}

function play (state, send) {
  if (state.playing) return send('player:pause')
  send('player:play')
}

module.exports = player
