# hot-spots

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Create add, remove, and position animated hotspots.

## Usage

[![NPM](https://nodei.co/npm/hot-spots.png)](https://www.npmjs.com/package/hot-spots)

## Example
```javascript
var hotSpots = require('hot-spots');

var els = getElements();

var hotSpotAnimations = {
  hotSpot1: [
    { time: 100, position: [ 0, 100 ] },
    { time: 500, position: [ 100, 200 ] },
    { time: 1000, position: [ 0, 400 ] }
  ],

  hotSpot2: [
    { time: 600, position: [ 300, 100 ] },
    { time: 800, position: [ 200, 200 ] },
    { time: 1400, position: [ 100, 400 ] }
  ]
};

var hotspots = hotSpots(hotSpotAnimations);

hotspots.on('add', function(spots) {
  // spots == an array of hotspots to add
  // eg. ['hotspot1', 'hotspot2']
  console.log('Add these hotspots to screen', spots);
});

hotspots.on('remove', function(spots) {
  // spots == an array of hotspots to remove
  // eg. ['hotspot1', 'hotspot2']
  console.log('Remove these hotspots to screen', spots);
});

hotspots.on('update', function(spots) {
  // spots == an object which defines where all hotspots
  // should be
  // eg. {
  //    hotSpot1: [ 120, 240 ],
  //    hotSpot2: [ 300, 100 ]
  // }
  console.log('Update these hotspots on screen', spots);
});

hotspots.start();
```

## API

### `emitter = require('hot-spot')(hotSpotAnimations)`

Takes an Object which defines hot spot animations. An `EventEmitter` is returned from which you can receive for events for when: hotspots should be added to scree, removed from screen, or their position should be updated.

`hotSpotAnimations` are defined in the following form: 
```javascript
var hotSpotAnimations = {
    hotSpotName: [
        { time: 1000, position: [0, 0] },
        { time: 2000, position: [100, 100] },
    ]
};
```

It should be noted that `time` is in milliseconds and `position` is an array representing `[x, y, z, ...]`. `position` can be an Array of any length.

### `emitter.start()`

Will start the hotspot animations.

### `emitter.stop()`

Will stop hotspot animations.

### `emitter.seek(time)`

Will seek the hotspot animation to a different time. `time` should be in milliseconds.

### `emitter.time` 

The current time the hotspot animation is at in milliseconds.

### `emitter.duration`

The duration of the hotspot animation in milliseconds.

### `emitter.on('add', listener)`

Will notify you of when hotspots should be added to screen by name.

### `emitter.on('remove', listener)`

Will notify you of when hotspots should be removed from screen.

### `emitter.on('update', listener)`

Will fire when hotspot's positions must be updated.


## License

MIT, see [LICENSE.md](http://github.com/mikkoh/hot-spots/blob/master/LICENSE.md) for details.
