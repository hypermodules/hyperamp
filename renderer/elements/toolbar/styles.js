var css = require('csjs-inject')

module.exports = css`
  .toolbar {
    -webkit-app-region: drag;
    border-bottom: var(--border);
    height: 40px;
    padding-right: 1em;
    padding-left: 6em;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .rightCluster {
    display: flex;
    align-items: center;
  }
`
