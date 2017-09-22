var css = require('csjs-inject')

module.exports = css`
  .playlist {
    position: absolute;
    left: 0;
    right: 0;
    top: 38px;
    bottom: 0;
  }

  .tableScrollWindow {
    overflow: auto;
    position: absolute;
    left: 0;
    right: 0;
    top: 30px;
    bottom: 0;
  }
  .tableContainer { position: relative }

  .mediaList {
    table-layout: fixed;
    width: 100%;
    min-width: 1000px;
    border-spacing: 0;
    border: 0;
    border-collapse: separate;
    text-align: left;
    position: absolute;
    contain: layout;
  }

  .mediaList td {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mediaList th { font-weight: var(--font-weight-default) }

  .stickyHead th {
    position: sticky;
    top: 0px;
    background-color: var(--bg);
    font-weight: 500;
    border-bottom: var(--border);
  }

  .mediaList td, th {
    height: 38px;
    padding: 0 15px;
  }

  .mediaList tr:nth-child(even) { background: var(--darken) }
  .mediaList tbody tr.selected { background: rgba(255,102,51,.1) }

  /* use colgroup to sanely apply width properties  */
  /* https://docs.webplatform.org/wiki/html/elements/colgroup */
  .mediaList .title { width: 12em }
  .mediaList .time { width: 4em }
  .mediaList .artist { width: 10em }
  .mediaList .album { width: 8em }
  .mediaList .track { width: 4em }
  .mediaList .disk { width: 4em }
  .mediaList .year { width: 4em }
  .playing { font-weight: 500 }
`
