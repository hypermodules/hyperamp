var css = require('csjs-inject')

module.exports = css`
  .footer {
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
  }

  .track {
    padding: .5em;
    width: 100%;
  }

  @media (max-width: 460px) {
    .footer {
      border-left: none;
      min-width: initial;
      max-width: initial;
      width: 100%;
    }

    .track { padding: 0 }
  }
`
