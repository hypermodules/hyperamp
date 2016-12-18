const choo = require('choo')
const log = require('choo-log')
const config = require('./lib/config')
const app = window.hyperamp = choo()
const entypoSprite = require('entypo').getNode()
document.body.insertBefore(entypoSprite, document.body.firstChild)

app.use(log())

app.model(require('./models/player'))
app.model(require('./models/library')(config))
app.model(require('./models/config')(config))

app.router({ default: '/' }, [
  ['/', require('./views/main')],
  ['/preferences', require('./views/preferences')]
])

const tree = app.start()
document.body.querySelector('#app').appendChild(tree)
