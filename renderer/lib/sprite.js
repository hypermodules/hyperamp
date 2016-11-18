const path = require('path')
const fs = require('fs')

module.exports = main

function main () {
  const svgSprite = fs.readFileSync(path.join(__dirname, '../dist/sprite.svg'), 'utf8')
  return svgSprite
}
