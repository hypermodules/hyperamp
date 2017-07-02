exports.formatCount = formatCount

function formatCount (countObj) {
  if (!countObj.no && !countObj.of) return ''
  if (!countObj.of) return countObj.no.toString()
  return `${countObj.no} of ${countObj.of}`
}
