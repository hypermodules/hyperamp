var isDev = require('electron-is-dev')
if (!isDev) window.raven = require('../../lib/sentry.js')
if (isDev || process.env.DEV_SERVER) {
  var bundle = document.createElement('script')
  bundle.src = 'http://localhost:9966/bundle.js'
  document.body.appendChild(bundle)
} else {
  window.localStorage.DISABLE_NANOTIMING = true
  require('./bundle.js')
}
