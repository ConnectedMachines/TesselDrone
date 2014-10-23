var mainControl = require('./mainControl.js');
var tessel = require('tessel');
var servo = require('servo-pca9685').use(tessel.port['C']);
var motors = mainControl.motors;
var isLanding = mainControl.isLanding;
var isHovering = mainControl.isHovering;

var land = function(){
  isLanding = true;
  isHovering = false;
  motors[1].setThrottle(0);
  motors[2].setThrottle(0);
  motors[3].setThrottle(0);
  motors[4].setThrottle(0);
  console.log('Landed. All motors should be off.');
};

exports.land = land;