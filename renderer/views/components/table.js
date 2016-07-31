const html = require('choo/html')
const list = [{
  title: 'Tell My What You See',
  artist: 'The Beatles',
  album: 'Help!'
}, {
  title: 'C.R.E.A.M.',
  artist: 'Wu-Tang Clan',
  album: 'Enter The Wu-Tang (36 Chambers)'
}]

module.exports = (state, prev, send) => html`
  <table class="table-striped">
    <thead>
      <tr>
        <th>Title</th>
        <th>Artist</th>
        <th>Album</th>
      </tr>
    </thead>
    <tbody>${renderList(state)}</tbody>
  </table>
`

function renderList (state) {
  return list.filter(song => {
    if (!state.search) return song

    var yep = Object.keys(song)
      .map(i => song[i].toLowerCase())
      .filter(s => s.includes(state.search.toLowerCase()))
      .length > 0

    if (yep) return song
    return false
  }).map(song => {
    return html`
      <tr>
        <td>${song.title}</td>
        <td>${song.artist}</td>
        <td>${song.album}</td>
      </tr>
    `
  })
}
