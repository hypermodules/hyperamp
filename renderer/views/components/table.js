const html = require('choo/html')
const fd = require('format-duration')
const css = require('csjs-inject')

const style = css`
  .pane {
    flex: 1 0;
    overflow-y: auto;
    height: 100%;
  }

  .mediaList {
    table-layout: fixed;
  }

  .mediaList .time {
    text-align: right;
  }
`

module.exports = (state, prev, send) => html`
  <section class="${style.pane}">
  <table class="${style.mediaList}">
    <thead>
      <tr>
        <th>Title</th>
        <th class="time">Time</th>
        <th>Artist</th>
        <th>Album</th>
      </tr>
    </thead>
    <tbody>${renderList(state, send)}</tbody>
  </table>
`

function renderList (state, send) {
  let { files, search } = state.library
  let list = sortList(files)

  if (search) list = filterList(list, search)

  return list.map(meta => {
    return html`
      <tr onclick=${(e) => send('player:play', meta)}>
        <td>${meta.title}</td>
        <td class="time">${fd(meta.duration * 1000)}</td>
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
