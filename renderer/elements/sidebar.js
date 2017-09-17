var html = require('choo/html')
var css = require('csjs-inject')
var button = require('./button')

var styles = css`
  .sidebar {
    border-right: var(--border);

    width: 300px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
  }
  .header {
    padding: 0 .5em 0 6.5em;
    height: 40px;
    display: flex;
    align-items: center;
    border-bottom: var(--border);
    justify-content: flex-end;
  }
  .playlists {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .list {
    padding: 0 1em;
    height: 40px;
    align-items: center;
    display: flex;
  }
  .selected {
    font-weight: 500;
    background: var(--highlight);
  }
  .btn {
    background: var(--dark);
    border-radius: 50%;
  }
`

function sidebar (state, emit) {
  return html`
    <div class=${styles.sidebar}>
      <div class=${styles.header}>
        ${button({ className: styles.btn, iconName: 'entypo-plus' })}
      </div>
      <ul class=${styles.playlists}>
        <li class=${styles.list}>Mario Twins</li>
        <li class='${styles.list} ${styles.selected}'>Legit Albums</li>
        <li class=${styles.list}>Samples</li>
      </ul>
    </div>
  `
}

module.exports = sidebar
