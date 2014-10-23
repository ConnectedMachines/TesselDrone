var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['D']);
var servo = require('servo-pca9685').use(tessel.port['C']);
var mainControl = require('./mainControl.js');
var land = require('./land.js')land;
var setThrottle = mainControl.setThrottle;
var accelData = mainControl.accelData;
var userReady= mainControl.userReady;

accel.on('data', function(xyz){
  accelData = xyz;
});

var checkIfReadyToLaunch = function(){
  setImmediate(function(){
    if(userReady){
      setTimeout(function(){
        launch();
      }, 500);
    } else {
      checkIfReadyToLaunch();
    }
  })
};

checkIfReadyToLaunch();

<<<<<<< HEAD
var throttleUp = function(motorNumber){
  var motor = mainControl.motors[motorNumber];
  var proposedMotorThrottle = motor.currentThrottle+mainControl.minThrottleIncrement;
  if(proposedMotorThrottle <= mainControl.motorMaxThrottle){
    console.log('proposedMotorThrottle',proposedMotorThrottle, motor);
=======
var throttleUp = function(motorNumber, boost){
  var boost = boost || 0;
  var motor = motors[motorNumber];
  var proposedMotorThrottle = motors[motorNumber].currentThrottle+throttleIncrement+juice;
  if(proposedMotorThrottle <= motorMaxThrottle){
>>>>>>> 961be282f7c1b034e27a60b61be85c963af0f553
    motor.setThrottle(proposedMotorThrottle);
  }
};

var throttleDown = function(motorNumber){
  var motor = motors[motorNumber];
  var proposedMotorThrottle = motor.currentThrottle-throttleIncrement;
  if(proposedMotorThrottle >= 0){
    console.log('proposedMotorThrottle',proposedMotorThrottle, motor);
    motor.setThrottle(proposedMotorThrottle);
  }
};

var balanceAxis = function(axis){
  var balanceMotors = function(posMotor, negMotor, accelReading){
    if(accelReading > accelThresholdBeforeBalancing){
      throttleDown(posMotor);
      throttleUp(negMotor);
    }
    else if(accelReading < -1 * accelThresholdBeforeBalancing){
      throttleDown(negMotor);
      throttleUp(posMotor);
    }
    else{
      throttleUp(1, 0.002);
      throttleUp(2, 0.002);
      throttleUp(3, 0.002);
      throttleUp(4, 0.002);
    }
    setImmediate(function(){
      balanceAxis(axis); //After balancing motors call balanceAxis
    });
  }; 
  if(axis === 'x'){
    balanceMotors(1,2, accelData[0]);
  } else if (axis === 'y'){
    balanceMotors(4,3, accelData[1]);
  }
};

var launch = function(){
  //Gets accelerometer data from accelerometer (xyz);
  //if still isHovering - go through event loop
  if(isHovering){
    setImmediate(function(){
      balanceAxis('x');
    });

    setImmediate(function(){
      balanceAxis('y');
    });
  } else {
    if(isLanding){
      land();
    }
  }
};
