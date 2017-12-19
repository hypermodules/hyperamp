var { globalShortcut } = require('electron')

class GlobalShortcuts {
  construtor () {
    this.actions = {}
  }

  init (actions = {}) {
    this.actions = actions
    this.register(actions)
  }

  register (actions) {
    Object.entries(actions).forEach(entry => {
      globalShortcut.register(entry[0], entry[1])
    })
  }

  reregister () {
    globalShortcut.unregisterAll()
    this.register(this.actions)
  }

  unregisterAll () {
    globalShortcut.unregisterAll()
  }
}

module.exports = GlobalShortcuts
