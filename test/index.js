var hotSpots = require('./..');

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
  
  if(els) {
    spots.forEach(function(name) {
      if(els[ name ]) {
        document.body.appendChild(els[ name ]);
      }
    });
  } else {
    console.log('add', spots);
  }
});

hotspots.on('remove', function(spots) {
  
  if(els) {
    spots.forEach(function(name) {
      if(els[ name ]) {
        els[ name ].parentNode.removeChild(els[ name ]);
      }
    });
  } else {
    console.log('remove', spots);
  }
});

hotspots.on('update', function(spots) {

  if(els) {
    for(var i in spots) {
      els[ i ].style.left = spots[ i ][ 0 ] + 'px';
      els[ i ].style.top = spots[ i ][ 1 ] + 'px';
    }
  } else {
    console.log(spots);
  }
});

hotspots.start();


function getElements() {

  try {
    var elements = {};

    elements.hotSpot1 = document.createElement('div');
    elements.hotSpot2 = document.createElement('div');

    elements.hotSpot1.style.position = 'absolute';
    elements.hotSpot2.style.position = 'absolute';

    elements.hotSpot1.style.width = elements.hotSpot2.style.width = '100px';
    elements.hotSpot1.style.height = elements.hotSpot2.style.height = '100px';

    elements.hotSpot1.style.background = '#CAFE00';
    elements.hotSpot2.style.background = '#00CAFE';

    return elements;
  } catch(e) {}
}