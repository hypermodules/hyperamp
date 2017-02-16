var Application = require('spectron').Application
var test = require('tape')
var path = require('path')

test('does the thing turn on?', t => {
  var app = new Application({
    path: getElectronPath(),
    args: [path.join(__dirname, '..', 'main', 'index.js')]
  })

  app.start()
  .then(() => {
    t.pass('the app started up')
    return app.client.waitUntilWindowLoaded().getWindowCount()
  })
  .then(count => {
    t.is(count, 6, 'there are 6 browser windows for some reason')
  })
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

function getElectronPath () {
  var electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron')
  if (process.platform === 'win32') electronPath += '.cmd'
  return electronPath
}
