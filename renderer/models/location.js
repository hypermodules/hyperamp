// fix choo router when loading app from a file
// add this function as a subscription
// taken from https://github.com/sethvincent/adventuretron/blob/master/app/models/location.js#L25
// Be sure to disable default link handling app.start({href: false})
// thanks @sethvincent
module.exports = function location (options) {
  return {
    namespace: 'location',
    state: {
      pathname: '/'
    },
    reducers: {
      pathname: function (data, state) {
        return { pathname: data.pathname }
      }
    },
    subscriptions: [
      function catchLinks (send, done) {
        window.onclick = function (e) {
          var node = (function traverse (node) {
            if (!node) return
            if (node.localName !== 'a') return traverse(node.parentNode)
            if (node.href === undefined) return traverse(node.parentNode)
            if (window.location.host !== node.host) return traverse(node.parentNode)
            return node
          })(e.target)

          if (!node) return
          e.preventDefault()
          var href = node.href.replace('file://', '')

          send('location:pathname', { pathname: href.replace(/#$/, '') }, done)
        }
      }
    ]
  }
}
