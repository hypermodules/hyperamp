const html = require('choo/html')

module.exports = (state, prev, send) => {
  const home = () => send('location:setLocation', { location: '/' })

  const save = () => {
    let inputs = [].slice.call(document.querySelectorAll('input, button'))
    // TODO: photon doesn't have a disabled style yet
    inputs.map(el => el.disabled = true)
    // TODO: saving magic
    setTimeout(home, 100)
  }

  return html`
    <main class="window preferences">
      <header class="toolbar toolbar-header">
        <h1 class="title"><span class="icon icon-note-beamed"></span> ${state.title}</h1>
      </header>
      <div class="window-content">
        <div class="pane-group">
          <div class="pane">
            <form>
              <div class="form-group">
                  <label>Library Folder Path</label>
                  <input type="text" class="form-control" value="${state.config.music}">
              </div>
            </form>
          </div>
        </div>
      </div>
      <footer class="toolbar toolbar-footer">
        <div class="toolbar-actions">
          <button onclick=${home} class="btn btn-default">Cancel</button>
          <button onclick=${save} class="btn btn-primary pull-right">Save</button>
        </div>
      </footer>
    </main>
  `
}
