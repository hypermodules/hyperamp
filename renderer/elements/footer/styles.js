var css = require('csjs-inject')

module.exports = css`
  .footer {
    -webkit-app-region: drag;
    border-left: var(--border);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding: 0 0 1em;
    text-align: center;
    min-width: 250px;
    max-width: 250px;
    justify-content: space-between;
     will-change: transform;
  }

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

  .track {
    padding: .5em;
    width: 100%;
  }

  @media (max-width: 460px) {
    .footer {
      min-width: initial;
      max-width: initial;
      width: 100%;
    }
  }
`
