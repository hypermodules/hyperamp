const log = require('electron-log/renderer')
log.info('Log from the player process')
const choo = require('choo')
const { ipcRenderer } = require('electron')
const app = window.hyperamp = choo()

ipcRenderer.on('log', (ev, data) => console.log(data))

const entypoSprite = require('entypo').getNode()
document.body.insertAdjacentElement('afterbegin', entypoSprite)

app.use(require('choo-devtools')())

app.use(require('./stores/config'))
app.use(require('./stores/player'))
app.use(require('./stores/library'))

app.route('#', require('./pages/main'))
app.route('#preferences', require('./pages/preferences'))
app.mount('#app')

ipcRenderer.send('sync-state')
