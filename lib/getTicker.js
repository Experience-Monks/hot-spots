var rafLoop = require('raf-loop');
var EventEmitter = require('events').EventEmitter;

module.exports = function() {

  var engine = rafLoop( function(dt) {
    updateTime(ticker.time + dt);
  });

  var ticker = new EventEmitter();
  ticker.time = 0;
  
  ticker.start = function() {
    updateTime(ticker.time);
    engine.start();
  };

  ticker.stop = engine.stop.bind(engine);

  ticker.seek = function(time) {
    updateTime(time);
  };

  return ticker;

  function updateTime(time) {
    var previous = ticker.time;
    ticker.time = time;
    ticker.emit('time', previous, time);
  }
};