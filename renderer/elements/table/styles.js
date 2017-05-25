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
    border-spacing: 0;
    border: 0;
    border-collapse: separate;
    text-align: left;
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
    will-change: transform;
    overflow: auto;
    position: relative;
  }

  .tableContainer {
    position: absolute;
  }

  /* use colgroup to sanely apply width properties  */
  /* https://docs.webplatform.org/wiki/html/elements/colgroup */

  .mediaList  .time {
    text-align: right;
    width: 6em;
  }

  .mediaList  .track {
    width: 6em;
  }

  .playing {
    color: var(--link);
  }
`
