function filter (term, [key, track]) {
  var { title, album, artist } = track
  var artistStr = Array.isArray(artist) ? artist.join(', ') : artist
  var trackStr = (title + album + artistStr).toLowerCase().replace(/\s+/g, '')

  return trackStr.includes(term.toLowerCase().replace(/\s+/g, ''))
}

module.exports = filter
