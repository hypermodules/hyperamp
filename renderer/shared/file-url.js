const path = require('path')

// Vendored from https://github.com/sindresorhus/file-url/blob/982123e9af861ce26167de7ef40be3ff9cad2be7/index.js#L2
// because inconvient ESM upgrade

function fileUrl (filePath, options = {}) {
  if (typeof filePath !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof filePath}`)
  }

  const { resolve = true } = options

  let pathName = filePath
  if (resolve) {
    pathName = path.resolve(filePath)
  }

  pathName = pathName.replace(/\\/g, '/')

  // Windows drive letter must be prefixed with a slash.
  if (pathName[0] !== '/') {
    pathName = `/${pathName}`
  }

  // Escape required characters for path components.
  // See: https://tools.ietf.org/html/rfc3986#section-3.3
  return encodeURI(`file://${pathName}`).replace(/[?#]/g, encodeURIComponent)
}

module.exports = fileUrl
