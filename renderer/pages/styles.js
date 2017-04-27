var css = require('csjs-inject')

module.exports = css`
  .window {
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .pane {
    padding: 1rem;
  }

  .grow { flex: 1 }

  @media (max-width: 460px) {
    .grow { display: none }
  }
`
