var mainControl = require('./mainControl.js');
var servo = mainControl.servo;
var throttleIncrement = mainControl.throttleIncrement;
var motorMaxThrottle = mainControl.motorMaxThrottle;
var PIDoutput = require('./PID.js').PIDoutput;

var stabilize = function(posMotor, negMotor, axis){
  var currentError = mainControl.error[axis];
  var correction = PIDoutput(axis, currentError)/2;
  // console.log('PID Output / 2 ', correction)
  if(correction !== 0){  
    mainControl.motors[posMotor].setThrottle(mainControl.motors[posMotor].currentThrottle + (-1 * correction), axis);
    mainControl.motors[negMotor].setThrottle(mainControl.motors[negMotor].currentThrottle + correction, axis);
  } else {
    // console.log("correction is zero? ", correction);
    mainControl.axisChanging[axis] = false;
  }
  mainControl.previousError[axis] = currentError;
};

var whichAxisToStabilize = function(axis){
  var whichMotorsToStabilize = function(posMotor, negMotor, accelReading){
    if(!mainControl.axisChanging[axis] && (mainControl.error[axis] > mainControl.targetBalance || mainControl.error[axis] < -1 * mainControl.targetBalance)){ //Check flag for axis changing - potentially where code is stopping
      mainControl.axisChanging[axis] = true;
      stabilize(posMotor, negMotor, axis);
    } 
    else if (!mainControl.axisChanging['x'] && !mainControl.axisChanging['y']){
      console.log("THROTTLE IT UP")
      servo.move(1, mainControl.motors[1].currentThrottle + throttleIncrement, function(){
        mainControl.motors[1].currentThrottle = mainControl.motors[1].currentThrottle + throttleIncrement;
        mainControl.lobot.speak();        
      })
      servo.move(2, mainControl.motors[2].currentThrottle + throttleIncrement, function(){
        mainControl.motors[2].currentThrottle = mainControl.motors[2].currentThrottle + throttleIncrement;
        mainControl.lobot.speak();
      })
      servo.move(3, mainControl.motors[3].currentThrottle + throttleIncrement, function(){
        mainControl.motors[3].currentThrottle = mainControl.motors[3].currentThrottle + throttleIncrement;
        mainControl.lobot.speak(); 
      })
      servo.move(4, mainControl.motors[4].currentThrottle + throttleIncrement, function(){
        mainControl.motors[4].currentThrottle = mainControl.motors[4].currentThrottle + throttleIncrement;
        mainControl.lobot.speak();
      });
    }
    setImmediate(function(){
      whichAxisToStabilize(axis); //After balancing mainControl.motors call balanceAxis
    });
  };
  if(!mainControl.isLanding){
    if(axis === 'x'){
      whichMotorsToStabilize(1, 2, mainControl.error[axis]);
    } else if (axis === 'y'){
      whichMotorsToStabilize(4, 3, mainControl.error[axis]);
    }
  }
};

var throttleUp = function(motorNumber, axis){
  var proposedMotorThrottle = mainControl.motors[motorNumber].currentThrottle + throttleIncrement;
  if(proposedMotorThrottle <= motorMaxThrottle){
    mainControl.motors[motorNumber].setThrottle(proposedMotorThrottle, axis);
  }
};

exports.whichAxisToStabilize = whichAxisToStabilize;

