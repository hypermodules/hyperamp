var css = require('csjs-inject')

module.exports = css`
  .player {
    -webkit-app-region: drag;
    border-left: var(--border);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    text-align: center;
    min-width: 250px;
    max-width: 250px;
    justify-content: space-between;
    will-change: transform;
    contain: layout;
  }

  .track {
    padding: .5em;
    width: 100%;
  }

  @media (max-width: 460px) {
    .player {
      border-left: none;
      min-width: initial;
      max-width: initial;
      width: 100%;
    }

    .track { padding: 0 }
  }

  /* controls */
  .controls { font-size: 2em }
  .scrubberControl { width: 100% }
  .scrubber {
    cursor: default;
    position: relative;
    vertical-align: middle;
    -webkit-app-region: no-drag;
    width: 100%;
  }
  .trackControls { flex: 1 }

  .smallButtons { font-size: 0.5em }

  .disabled svg { fill: rgb(144, 144, 144) }

  /* meta */
  .meta { margin: 1rem 0 0 }
  .title, .artist { margin: 0 }
  .title { font-weight: 600 }

  /* artwork */
  .albumCover {
    position: relative;
    width: 100%; /* desired width */
    border-radius: 4px;
    overflow: hidden;
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

  @media (max-width: 460px) {
    .albumCover { border-radius: 0 }
  }

  /* volume */
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

// TODO: clean up these styles for shuffle buttons
