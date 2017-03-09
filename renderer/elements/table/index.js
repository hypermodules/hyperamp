var html = require('choo/html')
var fd = require('format-duration')
var styles = require('./styles')

function table (state, prev, send) {
  return html`
    <section class="${styles.pane}">
      <div class=${styles.tableHeader}>
        <table class="${styles.mediaList}">
          <thead>
            <tr>
              <th>Title</th>
              <th class="${styles.time}">Time</th>
              <th>Artist</th>
              <th>Album</th>
            </tr>
          </thead>
        </table>
      </div>
      <div class=${styles.tableBody}>
        <table class="${styles.mediaList} ${styles.tableBody}">
          <tbody>${renderList(state, send)}</tbody>
        </table>
      </div>
    </section>
  `
}

function renderList (state, send) {
  var { files, search } = state.library
  var list = files

  if (search) list = filterList(list, search)

  function playSong (meta) {
    send('player:updatePlaylist', list)
    send('player:queue', meta)
    send('player:play')
  }

  return list.map((meta, i) => {
    meta.index = i
    return html`
      <tr onclick=${playSong.bind(null, meta)}>
        <td>${meta.title}</td>
        <td class="${styles.time}">${meta.duration ? fd(meta.duration * 1000) : ''}</td>
        <td>${meta.artist}</td>
        <td>${meta.album}</td>
      </tr>
    `
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

module.exports = table
