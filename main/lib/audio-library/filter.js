function filter (term, [key, track]) {
  const { title, album, artist, genre } = track
  const artistStr = Array.isArray(artist) ? artist.join('') : artist
  const genreStr = Array.isArray(genre) ? genre.join('') : genre
  const trackStr = (title + album + artistStr + genreStr).toLowerCase().replace(/\s+/g, '')

  return trackStr.includes(term.toLowerCase().replace(/\s+/g, ''))
}

module.exports = filter
