var css = require('csjs-inject')

module.exports = css`
  .controls {
    font-size: 2em;
    margin: 1rem 0;
  }
  .scrubberControl {
    margin: 1rem 0;
    width: 100%
  }
  .scrubber {
    cursor: default;
    position: relative;
    vertical-align: middle;
    -webkit-app-region: no-drag;
    width: 100%;
  }
  .trackControls { flex: 1 }

  .smallButtons {
    font-size: 0.5em;
  }

  .disabled svg {
    fill: rgb(144, 144, 144);
  }
`

// TODO clean up these styles for shuffle byttons
