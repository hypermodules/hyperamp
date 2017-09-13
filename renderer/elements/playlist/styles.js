var css = require('csjs-inject')

module.exports = css`
  .playlist {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 77px;
  }

  .tableScrollWindow {
    position: absolute;
    top: 40px;
    right: 0;
    left: 0;
    bottom: 0;
    overflow: auto;
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

  /* .mediaList tr:nth-child(even),
  thead { background: var(--darken) } */

  .mediaList th {
    font-weight: var(--font-weight-default);
    /* border-right: var(--border);
    border-bottom: var(--border); */
  }
  /* .mediaList td { border-right: var(--border) }
  .mediaList th:last-child { border-right: none } */

  .stickyHead th {
    position: sticky;
    top: 0px;
    background-color: rgba(243,243,243,1);
    background-color: #fff;
    font-weight: 500;
    border-bottom: var(--border);
  }

  .mediaList td, th {
    height: 3em;
    padding: 2px 15px;
  }

  .mediaList tr:nth-child(even) { background: rgba(0,0,0,.02) }
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
