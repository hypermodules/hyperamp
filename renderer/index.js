var choo = require('choo')
// var log = require('choo-log')
var app = window.hyperamp = choo()
var mainView = require('./pages/main')
var preferences = require('./pages/preferences')
var entypoSprite = require('entypo').getNode()
document.body.insertBefore(entypoSprite, document.body.firstChild)

// app.use(log())

app.model(require('./models/config'))
app.model(require('./models/player'))
app.model(require('./models/library'))

app.route('/', mainView)
app.route('/preferences', preferences)
app.mount('#app')
