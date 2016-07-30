var remote = require('remote')
var Menu = remote.require('menu')
var MenuItem = remote.require('menu-item')
var selector = '[contextable]'

// Build our new menu
var menu = new Menu()

menu.append(new MenuItem({
  label: 'Alert Dialog',
  click: function (item, focusedWindow) {
    window.alert('This is an alert!')
  }
}))

menu.append(new MenuItem({ type: 'separator' }))
menu.append(new MenuItem({
  label: 'Console Log',
  click: function (item, focusedWindow) {
    console.log('context menu event', item, focusedWindow)
  }
}))
menu.append(new MenuItem({
  label: 'Check',
  type: 'checkbox', checked: true
}))

document.addEventListener('DOMContentLoaded', function () {
  var nodeList = document.querySelectorAll(selector)

  Array.prototype.forEach.call(nodeList, function (item) {
    item.addEventListener('contextmenu', function (event) {
      menu.popup(remote.getCurrentWindow());
    })
  })
})
