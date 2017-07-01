var css = require('csjs-inject')

module.exports = css`
  .volumeCluster { margin-bottom: .5em }

  .volumeButton { padding: 0 }

  .volumeSlider {
    position: relative;
    cursor: default;
    display: inline-block;
    vertical-align: middle;
    -webkit-app-region: no-drag;
    width: 100px;
    margin: 0 5px;
  }
`
