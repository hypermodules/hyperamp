var choo = require('choo')
// var log = require('choo-log')
var app = window.hyperamp = choo()

var entypoSprite = require('entypo').getNode()
document.body.insertBefore(entypoSprite, document.body.firstChild)

var mainView = require('./pages/main')
var preferences = require('./pages/preferences')

var configStore = require('./models/config')
var playerStore = require('./models/player')
var libraryStore = require('./models/library')
// app.use(log())

app.use(configStore)
app.use(playerStore)
app.use(libraryStore)

app.route('/', mainView)
app.route('/preferences', preferences)
app.mount('#app')
