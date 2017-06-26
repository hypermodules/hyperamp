#!/usr/bin/env electron

var Store = require('electron-store')

var config = new Store({ name: 'hyperamp-config' })
var persist = new Store({ name: 'hyperamp-persist' })

console.log('clearing %s', config.path)
config.clear()

console.log('clearing %s', persist.path)
persist.clear()

process.exit(0)
