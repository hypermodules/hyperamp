const html = require('choo/html')
const fd = require('format-duration')
const css = require('csjs-inject')

const style = css`
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

  /* note: sticky table header
  https://codepen.io/tjvantoll/pen/JEKIu
  */

  /* use colgroup to sanely apply width properties  */
  /* https://docs.webplatform.org/wiki/html/elements/colgroup */

  .mediaList  .time {
    text-align: right;
    width: 6em;
  }
`

module.exports = (state, prev, send) => html`
  <section class="${style.pane}">
    <div class=${style.tableHeader}>
      <table class="${style.mediaList}">
        <thead>
          <tr>
            <th>Title</th>
            <th class="${style.time}">Time</th>
            <th>Artist</th>
            <th>Album</th>
          </tr>
        </thead>
      </table>
    </div>
    <div class=${style.tableBody}>
      <table class="${style.mediaList} ${style.tableBody}">
        <tbody>${renderList(state, send)}</tbody>
      </table>
    </div>
  </section>
`

function renderList (state, send) {
  let { files, search } = state.library
  let list = sortList(files)

  if (search) list = filterList(list, search)

  return list.map(meta => {
    return html`
      <tr onclick=${(e) => send('player:play', meta)}>
        <td>${meta.title}</td>
        <td class="${style.time}">${meta.duration ? fd(meta.duration * 1000) : ''}</td>
        <td>${meta.artist}</td>
        <td>${meta.album}</td>
      </tr>
    `
  })
}

function sortList (files) {
  return files.sort((a, b) => {
    if (a.artist < b.artist) return -1
    if (a.artist > b.artist) return 1
    if (a.title < b.title) return -1
    if (a.title > b.title) return 1
    return 0
  })
}

function filterList (list, search) {
  return list.filter(meta => {
    var yep = Object.keys(meta)
      .map(i => (meta[i] + '').toLowerCase())
      .filter(s => s.includes(search.toLowerCase()))
      .length > 0

    if (yep) return meta
    return false
  })
}
