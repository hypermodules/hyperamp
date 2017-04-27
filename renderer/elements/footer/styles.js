var css = require('csjs-inject')

module.exports = css`
  .footer {
    -webkit-app-region: drag;
    border-right: var(--border);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding: 0 0 1em;
  }

  .albumCover {
    position: relative;
    width: 100%; /* desired width */
  }
  .albumCover:before {
    content: '';
    display: block;
    padding-top: 100%; /* initial ratio of 1:1*/
  }

  .albumArt {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    background: #eee;
    background-size: cover;
    background-position: center;
  }

  .meta {
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    padding: 1em;
  }

  .title, .artist { margin: 0 }
  .title { font-weight: 600 }

  .controls { margin: 1em 0 0 }

  .trackControls { flex: 1 }

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
