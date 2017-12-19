// modeled after https://github.com/codeforscience/sciencefair/blob/444bb75e0c73cc1e632ec833b98ba2d693668cde/app/client/lib/raven.js#L41
var os = require('os')
var log = require('electron-log')

var RAVEN_A = '3e06dec4e996422080e1853bdb663246' // eh.. can we get these out of source code?
var RAVEN_B = '7e4004b4423044b3b19d2f4523748552'
var RAVEN_C = '243594'

var MAIN_THREAD = 'browser'
var RENDERER = 'renderer'

function getopts (processtype) {
  return {
    captureUnhandledRejections: true,
    name: 'Hyperamp',
    release: require('../package.json').version,
    extra: {
      platform: os.platform(),
      process: processtype,
      release: os.release(),
      arch: os.arch(),
      totalmem: os.totalmem()
    },
    sendTimeout: 5,
    allowSecretKey: processtype === 'browser',
    debug: true
  }
}

// process.type === 'browser' : main thread
// process.type === 'renderer' : electron window
var raven = process.type === MAIN_THREAD ? require('raven') : require('raven-js')
var url = process.type === MAIN_THREAD ? `https://${RAVEN_A}:${RAVEN_B}@sentry.io/${RAVEN_C}` : `https://${RAVEN_A}@sentry.io/${RAVEN_C}`

if (process.type === MAIN_THREAD) {
    // Main thread stuff only
  process.on('uncaughtException', (err) => {
    log.error(err)
    const dialog = require('electron').dialog

    dialog.showMessageBox({
      title: 'An error occurred',
      message: `Sorry for the trouble, but an error has occurred in Hyperamp and we don't know how to recover from it.

If you are connected to the internet, this has been reported anonymously to the project maintainers - they will work on a fix.

The app may now quit - you can safely reopen it.`,
      detail: err.stack,
      buttons: ['OK']
    })
  })
}

if (process.type === RENDERER) {
    // Renderer stuff only
}

var sentry = raven.config(url, getopts(process.type)).install()
log.info(`Sentry installed (pid: ${process.pid})`)

module.exports = sentry
