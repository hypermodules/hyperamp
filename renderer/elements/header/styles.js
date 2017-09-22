var css = require('csjs-inject')

module.exports = css`
  .toolbar {
    -webkit-app-region: drag;
    height: 40px;
    padding: 0 .5em;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .searchInput {
    width: 100%;
    padding: 1px 5px;
    vertical-align: middle;
    min-height: auto;
    margin-right: 1em;
    height: 24px;
  }
`
