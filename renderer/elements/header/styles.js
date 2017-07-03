var css = require('csjs-inject')

module.exports = css`
  .toolbar {
    -webkit-app-region: drag;
    border-bottom: var(--border);
    height: 40px;
    padding: 0 .5em 0 6.5em;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .leftCluster, .rightCluster {
    display: flex;
    align-items: center;
  }
  .leftCluster { flex: 1 }
  .rightCluster { margin-left: auto }

  .searchInput {
    width: 100%;
    padding: 1px 5px;
    vertical-align: middle;
    min-height: auto;
    margin-right: 1em;
    height: 24px;
  }

  @keyframes ckw {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
  }

  .spin {
    animation: ckw 4s infinite linear;
  }
`
