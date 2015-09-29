var EventEmitter = require('events').EventEmitter;
var tweenFunction = require('tween-function');
var getTicker = require('./lib/getTicker');

module.exports = function(hotspots) {

  var emitter = new EventEmitter();
  var tweenFunctions = getTweenFunctions(hotspots);
  var ticker = getTicker();
  var hotSpotsOnScreen = [];

  ticker.on('time', update);

  emitter.time = 0;
  emitter.duration = tweenFunctions.$duration;
  emitter.start = ticker.start.bind(ticker);
  emitter.stop = ticker.stop.bind(ticker);
  emitter.seek = ticker.seek.bind(ticker);

  // we won't need the duration anymore so we'll remove
  delete tweenFunctions.$duration;

  return emitter;

  function update(time) {

    var update = {};
    var updateKeys;
    var hotSpotsToAdd;
    var hotSpotsToRemove;
    var hotSpotAnimations;
    var animation;
    var position;

    if(emitter.time < emitter.duration || time <= emitter.duration) {

      // if the time is greater then the duration of the animations
      // then we'll just set time to be the duration
      if(time > emitter.duration) {
        time = emitter.duration;
      }

      emitter.time = time;
        
      // loop through and figure out what hotspots are on screen and where
      for(var hotspotName in tweenFunctions) {
        hotSpotAnimations = tweenFunctions[ hotspotName ];

        for(var i = 0; i < hotSpotAnimations.length; i++) {
          animation = hotSpotAnimations[ i ];

          if(animation.timeStart <= time && animation.timeEnd >= time) {
            position = [];
            animation.tweens.forEach( function(tween, i) {
              position[ i ] = tween(time);
            });

            update[ hotspotName ] = position;

            break;
          }
        }
      }

      updateKeys = Object.keys(update);

      // now figure out what hotspots were added
      hotSpotsToAdd = updateKeys.filter(function(hotspotName) {
        var doAdd = hotSpotsOnScreen.indexOf(hotspotName) === -1;

        if(doAdd) {
          hotSpotsOnScreen.push(hotspotName);
        }

        return doAdd;
      }); 

      // now figure out what hot spots were removed
      hotSpotsToRemove = hotSpotsOnScreen.filter(function(hotspotName) {
        var doRemove = updateKeys.indexOf(hotspotName) === -1;

        if(doRemove) {
          hotSpotsOnScreen.splice(hotSpotsOnScreen.indexOf(hotspotName), 1);
        }

        return doRemove;
      });

      // emit update add
      if(hotSpotsToAdd.length) {
        emitter.emit('add', hotSpotsToAdd);
      }

      if(hotSpotsToRemove.length) {
        emitter.emit('remove', hotSpotsToRemove);
      }

      if(updateKeys.length) {
        emitter.emit('update', update);
      }
    } else if(hotSpotsOnScreen.length) {
      emitter.emit('remove', hotSpotsOnScreen);
      hotSpotsOnScreen = [];
    }
  }
};


function getTweenFunctions(hotspots) {

  // it's handy to just return the duration of all animations here
  // even though it might sense to just get tween functions in
  // this function it'll be more performant to do both at the same time
  var rVal = {
    $duration: 0
  };
  var animations;
  var previous;
  var current;
  var tweens;

  for(var hotspotName in hotspots) {

    animations = hotspots[ hotspotName ];
    rVal[ hotspotName ] = [];

    for(var i = 1; i < animations.length; i++) {
      previous = animations[ i - 1 ];
      current = animations[ i ];
      tweens = [];

      previous.position.forEach( function(value, i) {
        tweens.push(
          getTweenFunction(
            previous.position[ i ],
            current.position[ i ],
            previous.time,
            current.time - previous.time
          )
        );
      });

      rVal[ hotspotName ].push( {
        timeStart: previous.time,
        timeEnd: current.time,
        tweens: tweens
      });

      if(current.time > rVal.$duration) {
        rVal.$duration = current.time;
      }
    }
  }

  return rVal;
}

function getTweenFunction(valueStart, valueEnd, delay, duration) {
  var tween = tweenFunction( {
    delay: delay,
    duration: duration
  });

  return function(time) {
    return tween(time, valueStart, valueEnd);
  };
}