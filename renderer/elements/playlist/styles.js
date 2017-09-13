var css = require('csjs-inject')

module.exports = css`
  .pane {
    flex: 1 0;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
  }

  .mediaList {
    table-layout: fixed;
    width: 100%;
    min-width: 1000px;
    border-spacing: 0;
    border: 0;
    border-collapse: separate;
    text-align: left;
    contain: layout;
  }

  .mediaList td {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mediaList tr:nth-child(even), thead {
    background: var(--darken);
  }

  .mediaList th {
    font-weight: var(--font-weight-default);
    border-right: var(--border);
    border-bottom: var(--border);
  }
  .mediaList td {
    border-right: var(--border);
  }
  .mediaList th:last-child {
    border-right: none;
  }

  .mediaList td, th {
    padding: 2px 15px;
  }

  .mediaList tbody tr.selected {
    background: var(--dark);
  }

  .tableHeader {
    flex: 0 0;
  }

  .tableScrollWindow {
    flex: 1 0;
    overflow-y: overlay;
    overflow-x: overlay;
    will-change: transform;
    contain: content;
  }

  .tableContainer {
    position: relative;
  }

  .tableRel {
    position: absolute;
  }

  /* use colgroup to sanely apply width properties  */
  /* https://docs.webplatform.org/wiki/html/elements/colgroup */

  .mediaList .title {
    width: 12em;
  }

  .mediaList .time {
    text-align: right;
    width: 4em;
  }

  .mediaList .artist {
    width: 10em;
  }

  .mediaList .album {
    width: 8em;
  }

  .mediaList .track {
    text-align: right;
    width: 4em;
  }

  .mediaList .disk {
    text-align: right;
    width: 4em;
  }

  .mediaList .year {
    width: 4em;
  }

  .playing {
    color: var(--link);
  }

  .stickyHead th {
    position: sticky;
    top: 0px;
    background-color: rgba(243,243,243,1);
  }
`
