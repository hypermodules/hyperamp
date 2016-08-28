const choo = require('choo')
const log = require('choo-log')
const location = require('choo-location-electron')
const config = require('./lib/config')
const app = window.hyperamp = choo()

app.use(log())

app.model(location)
app.model(require('./models/player'))
app.model(require('./models/library')(config))
app.model(require('./models/config')(config))

app.router(route => [
  route('/', require('./views/main')),
  route('/preferences', require('./views/preferences'))
])

const tree = app.start({ href: false })
document.body.querySelector('#app').appendChild(tree)
