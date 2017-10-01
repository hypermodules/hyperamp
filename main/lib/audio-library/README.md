#AudioLibrary

A class to manage playback state

## API
### `al = new AudioLibrary([state])`
Create a new `AuditLibrary` instance.  Optionally pass a state object with the following values:

```js
{
  trackDict: {}, // Dictionary of track objects
  order: [], // Array of track object keys defining order of display and playback
  index: 0, // Index of currently queued track
  shuffleOrder: null, // array of index's pointing to keys in the order array
  shuffleIndex: 0, // index of shuffleOrder index of order
  searchTerm: '' // search term used to generate current order array
}
```

### `al.isNewQuery`
Getter that returns true if `al` is in a search state.

### `al.shuffling`
Getter that returns true if `al` is shuffling playback order.

### `al.currentKey`
Getter that returns the key of the currently keyed track.

### `al.currentTrack`
Getter that returns the currently queued track object.

### `al.visibleOrder`
Getter that returns the correct `order` array to display regardless of query state.

### `queuedTrack = al.queue(index)`
Queue the track at `index` in the `visibleOrder` array.  If `al` is in a query state, the active query will become the primary order and the query state will be cleared.  Returns the track object at `index`.

### `nextTrack = al.next()`
Advance playback to correct next track, depending on shuffle state.  Does not affect query state and returns the next track in the currently playing `order`.

### `prevTrack = al.prev()`
Advance playback to correct previous track, depending on shuffle state.  Does not affect query state and returns the previous track in the currently playing `order`.

### `al.shuffle()`
Put `al` into shuffle mode.  If `al` is already shuffling, the shuffle order will be reshuffled.

### `al.unshuffle()`
Resume unshuffle order from the current `index`.

### `queryOrder = al.search(term)`
Perform a search on the currently loaded `trackDict`.  Puts `al` into query mode (`al.isNewQuery === true`).  In query mode `al.visibleOrder` returns the `al.query.order` so that the interface performing the search can preview the results of the search.  If `al.queue(index)` is called in query mode, `al.query.order` is assigned to `al.order` and the query is cleared and the query order becomes the play order.

### `playOrder = al.recall()`
If in query mode, calling `al.recall()` will clear the query and `al.visibleOrder` returns `al.order`.


### `{trackDict, order} = al.update(newTrackDict)`
Load a new `trackDict`.  Returns the minimal state nessisary to display the updated library.
