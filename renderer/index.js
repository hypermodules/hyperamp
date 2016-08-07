const choo = require('choo')
const view = require('./views/main')
const preferences = require('./views/preferences')
const model = require('./models/main')
const location = require('./models/location')
const app = choo()

app.model(model)
app.model(location())
app.router(route => [
  route('/', view),
  route('/preferences', preferences)
])

const tree = app.start({ href: false })
document.body.appendChild(tree)
