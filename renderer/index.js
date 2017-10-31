var choo = require('choo')
var ipcRenderer = require('electron').ipcRenderer
var ipcLog = require('nanologger')('ipc')
var app = window.hyperamp = choo()
var ipcLogger = require('electron-ipc-log')

ipcLogger(event => {
  var { channel, data, sent, sync } = event
  var args = [sent ? '⬆️' : '⬇️', channel, ...data]
  if (sync) args.unshift('sync')
  ipcLog.info.apply(ipcLog, args)
})

var entypoSprite = require('entypo').getNode()
document.body.insertAdjacentElement('afterbegin', entypoSprite)

app.use(require('choo-log')())
app.use(require('choo-devtools')())

app.use(require('./stores/config'))
app.use(require('./stores/player'))
app.use(require('./stores/library'))

app.route('#', require('./pages/main'))
app.route('#preferences', require('./pages/preferences'))
app.mount('#app')

ipcRenderer.send('sync-state')
