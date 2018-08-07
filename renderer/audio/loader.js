var isDev = require('electron-is-dev')
if (!isDev) require('../../lib/sentry.js')
require('./index.js')
