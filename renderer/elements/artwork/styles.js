var css = require('csjs-inject')

module.exports = css`
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
`
