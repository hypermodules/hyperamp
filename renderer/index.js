const choo = require('choo')
const html = require('choo/html')
const view = require('./views/main')
const model = require('./models/main')
const app = choo()

app.model(model)
app.router(route => [route('/', view)])

const tree = app.start()
document.body.appendChild(tree)
