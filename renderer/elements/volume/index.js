var html = require('choo/html')
var styles = require('./styles')
var button = require('../button')
var buttonStyles = require('../button/styles')

var opts = {
  min: 0,
  max: 1,
  step: 0.01
}

function volume (state, send) {
  return html`
    <div class='${buttonStyles.btnGroup}'>
      ${button({
        onclick: () => send('player:mute'),
        iconName: state.mute ? 'entypo-sound-mute' : 'entypo-sound'
      })}
      ${button({ className: styles.volumeButton }, html`
        <input type='range'
          class='${styles.volumeControl}'
          min='${opts.min}' max='${opts.max}' step='${opts.step}'
          oninput=${(e) => send('player:volume', { volume: e.target.value })}
          value='${state.volume}'>
      `)}
    </div>
  `
}

module.exports = volume
