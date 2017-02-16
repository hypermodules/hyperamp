var choo = require('choo')
var log = require('choo-log')
var app = window.hyperamp = choo()
var entypoSprite = require('entypo').getNode()
document.body.insertBefore(entypoSprite, document.body.firstChild)

app.use(log())

window.files = []

app.model(require('./models/config'))
app.model(require('./models/player'))
app.model(require('./models/library'))

app.router({ default: '/' }, [
  ['/', require('./views/main')],
  ['/preferences', require('./views/preferences')]
])

var tree = app.start()
document.body.querySelector('#app').appendChild(tree)
