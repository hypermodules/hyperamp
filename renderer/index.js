const choo = require('choo')
const html = require('choo/html')
const app = choo()

app.model({
  state: { title: 'HyperAmp' },
  reducers: {
    update: (data, state) => ({ title: data })
  }
})

const mainView = (state, prev, send) => html`
  <main class="window">
    ${toolbar(state, prev, send)}
    ${content(state, prev, send)}
  </main>
`

const toolbar = (state, prev, send) => html`
  <header class="toolbar toolbar-header">
    <h1 class="title"><span class="icon icon-note-beamed"></span> ${state.title}</h1>

    <div class="toolbar-actions">
      <div class="btn-group">
        <button class="btn btn-default">
          <span class="icon icon-fast-backward"></span>
        </button>
        <button class="btn btn-default">
          <span class="icon icon-play"></span>
        </button>
        <button class="btn btn-default">
          <span class="icon icon-fast-forward"></span>
        </button>
      </div>

      <span class="btn pull-right">
        <input type="range" min="0" max="100" value="100">
      </span>
    </div>
  </header>
`

function table (state, prev, send) {
  const list = [{
    title: 'Tell My What You See',
    artist: 'The Beatles',
    album: 'Help!'
  },{
    title: 'C.R.E.A.M.',
    artist: 'Wu-Tang Clan',
    album: 'Enter The Wu-Tang (36 Chambers)'
  }].map(song => {
    return html`
      <tr>
        <td>${song.title}</td>
        <td>${song.artist}</td>
        <td>${song.album}</td>
      </tr>
    `
  })

  return html`
    <table class="table-striped">
      <thead>
        <tr>
          <th>Title</th>
          <th>Artist</th>
          <th>Album</th>
        </tr>
      </thead>
      <tbody>${list}</tbody>
    </table>
  `
}

const content = (state, prev, send) => html`
  <div class="window-content">
    <div class="pane-group">
      <div class="pane">
        <ul class="list-group">
          <li class="list-group-header">
            <input
              type="text"
              class="form-control"
              placeholder="Search"
              oninput=${(e) => send('update', e.target.value)}>
          </li>
        </ul>
        ${table(state, prev, send)}
      </div>
    </div>
  </div>
`

app.router(route => [
  route('/', mainView)
])

var tree = app.start()
document.body.appendChild(tree)
