const choo = require('choo')
const view = require('./views/main')
const preferences = require('./views/preferences')
const model = require('./models/main')
const app = choo()

app.model(model)
app.router(route => [
  route('/', view),
  route('/preferences', preferences)
])

const tree = app.start()
document.body.appendChild(tree)
