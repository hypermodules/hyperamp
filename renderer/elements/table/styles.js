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
    background: var(--lighten);
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

  .mediaList thead th:active,
  .mediaList tbody tr:active {
    background: var(--light);
  }

  .tableHeader {
    flex: 0 0;
  }

  .tableBody {
    flex: 1 0;
    overflow: overlay;
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
`
