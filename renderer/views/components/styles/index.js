const css = require('csjs')
const fs = require('fs')
const path = require('path')
const text = fs.readFileSync(path.join(__dirname, 'buttons.css'), 'utf8')
console.log(text)
const buttons = css`${text}`
exports.buttons = {}

console.log(buttons)
