const choo = require('choo')
const location = require('choo-location-electron')
const app = choo()

app.model(location)
app.model(require('./models/main'))
app.model(require('./models/config'))

app.router(route => [
  route('/', require('./views/main')),
  route('/preferences', require('./views/preferences'))
])

const tree = app.start({ href: false })
document.body.appendChild(tree)
