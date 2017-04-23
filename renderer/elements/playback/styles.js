var css = require('csjs-inject')

module.exports = css`
  .controls { margin: 1em 0 0 }
  .volumeSliderButton {
    display: inline-flex;
    flex: 1 1 100%;
  }
  .volumeSlider {
    cursor: default;
    position: relative;
    vertical-align: middle;
    -webkit-app-region: no-drag;
    width: 100%;
  }
`
