var mainControl = require('./mainControl.js');
var motors = mainControl.motors;
var error = mainControl.error;
var axisChanging = mainControl.axisChanging;
var previousError = mainControl.previousError;
var throttleIncrement = mainControl.throttleIncrement;
var motorMaxThrottle = mainControl.motorMaxThrottle;
var isLanding = mainControl.isLanding;
var PIDoutput = require('./PID.js').PIDoutput;

var stabilize = function(posMotor, negMotor, axis){
  var posMotor = motors[posMotor];
  var negMotor = motors[negMotor];
  var currentError = error[axis];
  var correction = PIDoutput(axis, currentError)/2;
  if(correction !== 0){  
    console.log('PID: '+correction);
    posMotor.setThrottle(posMotor.currentThrottle + (-1 * correction), axis);
    negMotor.setThrottle(negMotor.currentThrottle + correction, axis);
  }
  previousError[axis] = currentError;
};

var whichAxisToStabilize = function(axis){
  var whichMotorsToStabilize = function(posMotor, negMotor, accelReading){
    if(!axisChanging[axis] && (error[axis] > 0 || error[axis] < 0)){
      axisChanging[axis] = true;
      stabilize(posMotor, negMotor, axis);
    } 
    else if (!axisChanging[axis]){
      throttleUp(1, 'x');
      throttleUp(2, 'x');
      throttleUp(3, 'y');
      throttleUp(4, 'y');
    }
    setImmediate(function(){
      whichAxisToStabilize(axis); //After balancing motors call balanceAxis
    });
  };
  if(!isLanding){
    if(axis === 'x'){
      whichMotorsToStabilize(1,2, error[axis]);
    } else if (axis === 'y'){
      whichMotorsToStabilize(4,3, error[axis]);
    }
  }
};

var throttleUp = function(motorNumber, axis){
  var motor = motors[motorNumber];
  var proposedMotorThrottle = motors[motorNumber].currentThrottle + throttleIncrement;
  if(proposedMotorThrottle <= motorMaxThrottle){
    motor.setThrottle(proposedMotorThrottle, axis);
  }
};

exports.whichAxisToStabilize = whichAxisToStabilize;

