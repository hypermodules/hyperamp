const choo = require('choo')
const log = require('choo-log')
const location = require('choo-location-electron')
const app = window.hyperamp = choo()

app.use(log())

app.model(location)
app.model(require('./models/player'))
app.model(require('./models/config'))

app.router(route => [
  route('/', require('./views/player')),
  route('/preferences', require('./views/preferences'))
])

const tree = app.start({ href: false })
document.body.appendChild(tree)
