var css = require('csjs-inject')

module.exports = css`
  .footer {
    -webkit-app-region: drag;
    border-top: var(--border);
    display: flex;
    align-items: center;
    height: 100px;
    padding-left: 100px;
    position: relative;
  }

  .albumArt {
    background: black;
    border-right: var(--border);
    height: 99px;
    width: 99px;
    position: absolute;
    left: 0;
    bottom: 0;
    background-size: cover;
    background-position: center;
  }

  .meta {
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    padding: 0 1em;
  }

  .title, .artist { margin: 0 }
  .title { font-weight: 600 }

  .controls { margin: 1em 0 0 }

  .scrubberControl {
    display: inline-flex;
    flex: 1 1 100%;
  }

  .scrubber {
    cursor: default;
    position: relative;
    vertical-align: middle;
    -webkit-app-region: no-drag;
    width: 100%;
  }
`
