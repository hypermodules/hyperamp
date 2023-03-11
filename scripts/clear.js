#!/usr/bin/env electron

const Store = require('electron-store')

const config = new Store({ name: 'hyperamp-config' })
const persist = new Store({ name: 'hyperamp-persist' })
const library = new Store({ name: 'hyperamp-library' })

console.log('clearing %s', config.path)
config.clear()

console.log('clearing %s', persist.path)
persist.clear()

console.log('clearing %s', library.path)
library.clear()

process.exit(0)
