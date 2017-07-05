var choo = require('choo')
var ipcRenderer = require('electron').ipcRenderer
var log = require('choo-log')
var expose = require('choo-expose')
var app = window.hyperamp = choo()

var entypoSprite = require('entypo').getNode()
document.body.insertAdjacentElement('afterbegin', entypoSprite)

app.use(log())
app.use(expose())

app.use(require('./stores/config'))
app.use(require('./stores/player'))
app.use(require('./stores/library'))

app.route('#', require('./pages/main'))
app.route('#preferences', require('./pages/preferences'))
app.mount('#app')

ipcRenderer.send('sync-state')
