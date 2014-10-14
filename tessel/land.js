var mainControl = require('./mainControl.js');


var land = function(){
  mainControl.isLanding = true;
  mainControl.isHovering = false;
  mainControl.motors[1].setThrottle(0);
  mainControl.motors[2].setThrottle(0);
  mainControl.motors[3].setThrottle(0);
  mainControl.motors[4].setThrottle(0);
  // console.log('Landed. All motors should be off.');
};

exports.land = land;
