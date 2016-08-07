const html = require('choo/html')

module.exports = (state, prev, send) => html`
  <main class="window">
    <header class="toolbar toolbar-header">
      <h1 class="title"><span class="icon icon-note-beamed"></span> ${state.title}</h1>
      <div class="toolbar-actions"></div>
    </header>
    <div class="window-content">
      <div class="pane-group">
        <div class="pane">
          <form>
            <div class="form-group">
                <label>Library Folder Path</label>
                <input type="text" class="form-control" placeholder="~/music">
            </div>
          </form>
        </div>
      </div>
    </div>
    <footer class="toolbar toolbar-footer">
      <div class="toolbar-actions">
        <a href="/"><button class="btn btn-default">
          Cancel
        </button></a>

        <a href="/"><button class="btn btn-primary pull-right">
          Save
       </button></a>
      </div>
    </footer>
  </main>
`
