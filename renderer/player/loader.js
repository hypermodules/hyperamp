const remote = require('@electron/remote')
const isPackaged = remote.app.isPackaged
const isDev = !isPackaged

if (isDev || process.env.DEV_SERVER) {
  const bundle = document.createElement('script')
  bundle.src = 'http://localhost:9966/bundle.js'
  document.body.appendChild(bundle)
} else {
  window.localStorage.DISABLE_NANOTIMING = true
  require('./bundle.js')
}
