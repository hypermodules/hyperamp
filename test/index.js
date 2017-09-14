var Application = require('spectron').Application
var test = require('tape')
var path = require('path')

test('does the thing turn on?', t => {
  var app = new Application({
    path: require('electron'),
    args: [path.join(__dirname, '..', 'main', 'index.js')]
  })

  app.start().catch(err => {
    t.error(err, 'an error occured. uh oh')
  })
  .then(() => {
    t.pass('the app started up')
    return app.client.waitUntilWindowLoaded().getWindowCount()
  })
  // .then(count => {
  //   t.is(count, 4, 'there are 4 browser windows for some reason')
  // })
  .catch(err => {
    t.error(err, 'an error occured. uh oh')
  })
  .then(() => {
    app.stop()
  })
  .then(() => {
    t.end()
  })
})

test('pass', t => {
  t.end()
})
