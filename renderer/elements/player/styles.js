var css = require('csjs-inject')

module.exports = css`
  .player {
    -webkit-app-region: drag;
    border-top: var(--border);
    align-items: center;
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 77px;
    justify-content: space-between;
    will-change: transform;
    contain: layout;
    display: flex;
    padding: 0 10px 0 90px;
    background: #fff;
  }

  .controls {
    font-size: 1.5em;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-self: center;
    display: flex;
    flex-direction: row;
  }

  .disabled svg { fill: rgb(144, 144, 144) }

  .progress {
    display: flex;
    width: 100%;
    padding: 0 20px;
  }
  .time {
    font-size: 11px;
    display: inline-flex;
    align-items: center;
    min-width: 3em;
  }
  .time:first-child { justify-content: flex-end }
  .time:last-child { justify-content: flex-start }
  .range { width: 100% }
  .scrubber {
    cursor: default;
    position: relative;
    vertical-align: middle;
    -webkit-app-region: no-drag;
    width: 100%;
  }

  .meta {
    font-size: 12px;
    position: absolute;
    width: 100%;
    top: -16px;
    text-align: left;
    padding-left: 10px;
  }
  .title, .artist { margin: 0 }
  .title { font-weight: 600 }

  .volumeGroup button { padding-right: 0 }
  .volumeSlider {
    position: relative;
    cursor: default;
    display: inline-block;
    vertical-align: middle;
    -webkit-app-region: no-drag;
    width: 69px;
    margin: 0 5px;
  }
`

// TODO: clean up these styles for shuffle buttons
