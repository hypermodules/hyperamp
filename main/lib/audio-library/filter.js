function filter (term, [key, track]) {
  var { title, album, artist, genre } = track
  var artistStr = Array.isArray(artist) ? artist.join('') : artist
  var genreStr = Array.isArray(genre) ? genre.join('') : genre
  var trackStr = (title + album + artistStr + genreStr).toLowerCase().replace(/\s+/g, '')

  return trackStr.includes(term.toLowerCase().replace(/\s+/g, ''))
}

module.exports = filter
