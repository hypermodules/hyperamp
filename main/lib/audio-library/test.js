var test = require('tape')
var AudioLibrary = require('./index')
var libraryA = require('./test-data/library-a.json')
// var libraryB = require('./test-data/library-a.json')

test('instantiate, next, prev AudioLibrary', function (t) {
  var al = new AudioLibrary(libraryA)

  t.ok(al, 'AudioLibrary can instantiate with library object')
  t.equal(al.index, libraryA.index, 'index is instantiated from state correctly')

  t.equal(al.currentKey, libraryA.order[libraryA.index], 'current index is set correctly')

  t.deepEqual(al.visibleOrder, libraryA.order, 'visible order returns the correct order')

  t.ok(al.next(), 'can advance to the next track')
  t.ok(al.next(), 'can advance to the next track again')
  t.ok(al.next(), 'can advance to the next track one more time')

  t.equal(al.index, libraryA.index + 3, 'index is advanced by 3')
  t.deepEqual(al.currentTrack, libraryA.trackDict[libraryA.order[libraryA.index + 3]], 'we get the currentTrack')

  t.ok(al.prev(), 'can advance in reverse to the previous track')
  t.ok(al.prev(), 'can advance in reverse to the previous track again')
  t.ok(al.prev(), 'can advance in reverse to the previous track one more time')

  t.equal(al.index, libraryA.index, 'index reduced by 3')
  t.deepEqual(al.currentTrack, libraryA.trackDict[libraryA.order[libraryA.index]], 'we get the currentTrack')

  t.end()
})

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min // The maximum is exclusive and the minimum is inclusive
}

test('instantiate and queue', {timeout: 500}, function (t) {
  var al = new AudioLibrary(libraryA)

  t.plan(2)

  var newIndex = getRandomInt(0, libraryA.length - 1)

  al.queue(newIndex)
  t.deepEqual(al.currentTrack, libraryA.trackDict[libraryA.order[newIndex]], 'can queue a track when not searching or sorting')
  t.deepEqual(al.visibleOrder, al.order, 'visible order is showing the correct order')
})

test('visibleOrder and search', {timeout: 500}, function (t) {
  var al = new AudioLibrary(libraryA)
  t.deepEqual(al.visibleOrder, al.order, 'visible order is showing the intial order')
  t.equal(al.query, null, 'query is null')
  t.equal(al.isNewQuery, false, 'not in a new query state')

  var expectedResults = [ '/Users/bret/Resilio Sync/Music/BLVCK CEILING/meridian/08 25 cobainen.mp3' ]
  console.log('search for 25 cobainen')
  var results = al.search('25 cobainen')

  t.deepEqual(results, expectedResults, 'search returns a new order with results')
  t.deepEqual(al.query.order, expectedResults, 'there is a new order')
  t.equal(al.isNewQuery, true, 'we are in a new query state')
  t.deepEqual(al.visibleOrder, al.query.order, 'visible order is showing the new order')

  console.log('next()')
  al.next()
  t.deepEqual(
    al.currentTrack,
    libraryA.trackDict[libraryA.order[libraryA.index + 1]],
    ' we can still advance and get the next track of whatever is currently playing'
  )
  t.deepEqual(al.visibleOrder, al.query.order, 'we are still seeing our new query')

  console.log('recall()')
  al.recall()

  t.equal(al.query, null, 'new order cleared')
  t.equal(al.isNewQuery, false, 'no longer in a new query')

  console.log('search and queue')
  al.search('25 cobainen')
  al.queue(0)

  t.deepEqual(
    al.currentTrack,
    libraryA.trackDict[expectedResults[0]],
    'queuing something from our query saves to order and clears new order'
  )

  t.deepEqual(al.visibleOrder, al.order, 'visible order is showing play order')
  t.equal(al.query, null, 'new order cleared')
  t.equal(al.isNewQuery, false, 'no longer in a new query')

  console.log('next()')
  al.next()

  t.deepEqual(
    al.currentTrack,
    libraryA.trackDict[expectedResults[0]],
    'only one result so 🔂'
  )

  console.log('search(\'\') and queue()')
  al.search('') // clear search
  al.queue(0) // play from the full library

  t.equal(al.query, null, 'new order cleared')
  t.equal(al.isNewQuery, false, 'no longer in a new query')

  t.equal(al.visibleOrder.length, libraryA.order.length, 'visible order returns the correct order')

  t.end()
})

test('truffle shuffle', function (t) {
  var al = new AudioLibrary(libraryA)

  console.log('shuffle()')
  al.shuffle()
  var initialShuffleIndex = al.shuffleIndex
  console.log('next()')
  console.log('next()')
  al.next()
  al.next()

  t.equal(al.shuffleIndex, initialShuffleIndex + 2, 'shuffle index advances')
  t.deepEqual(al.currentTrack, al.trackDict[al.order[al.shuffleOrder[al.shuffleIndex]]], 'adancing returns the correct next track')

  console.log('prev()')
  al.prev()

  t.equal(al.shuffleIndex, initialShuffleIndex + 1, 'go back in shuffle order')
  t.deepEqual(al.currentTrack, al.trackDict[al.order[al.shuffleOrder[al.shuffleIndex]]], 'prev returns the previous track')
  var preUnshuffleIndex = al.index

  console.log('unshuffle()')
  al.unshuffle()
  t.equal(al.index, preUnshuffleIndex, 'index stays the same')
  t.equal(al.shuffling, false, 'not shuffling any more')
  t.equal(al.shuffleOrder, null, 'clear shuffle order')
  console.log('next()')
  al.next()
  t.equal(al.index, preUnshuffleIndex + 1, 'advances in the next direction')
  t.end()
})
