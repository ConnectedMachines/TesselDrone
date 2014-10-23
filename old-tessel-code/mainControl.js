var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['D']);
var servo = require('servo-pca9685').use(tessel.port['C']);

// ###############################
// SETTINGS
// ###############################
// Throttle settings
// Exhaustively tested. 
// maxPWM = 0.125; -- First value input for process.stdin (high value)
// minPWM = 0.002; // Second value input for process.stdin (low value)
// initialThrottle = 0.005; //Third value input for process.stdin
// increment forward to by 0.01 to 0.04 and then hover

var motorMaxThrottle = 0.06; 
var throttleIncrement = 0.001;
var maxThrottleDifference = 0.005;

// Sensor Calibrations
var accelData = null;
var accelMaxGs = 2; // in g's, possible values: 2 4 8
var accelThresholdBeforeBalancing = 0.04;
var accelReadsPerSecond = 350;

// Control flow variables
var isServoModuleReady = false;
var isAccelModuleReady = false;
var isHovering = true;
var isLanding = false;
var userReady = false;

// Log data to console to monitor motor speed/average speed/accelerometer reads
var colorGreen = '\033[92m';
var checkMark = '\u2714';
var colorRed = '\033[91m';
var colorWhite = '' //'\033[97m';
var staticLog = function(motor1, motor2, motor3, motor4){
  process.stdout.write('\u001B[2J\u001B[0;0f'
    +'Motor throttles:\n'
    +'1: '+motor1.toFixed(3)+'\n'
    +'2: '+motor2.toFixed(3)+'\n'
    +'3: '+motor3.toFixed(3)+'\n'
    +'4: '+motor4.toFixed(3)+'\n'
    +'A: '+((motor1+motor2+motor3+motor4)/4).toFixed(3)+'\n'
    +'X: '+accelData[0]+'\n'
    +'Y: '+accelData[1]
  );
};

<<<<<<< HEAD
//Motor Specific Functions
var arm = function() {
  var servoNumber = this.number;
  servo.configure(servoNumber, minPWM, maxPWM , function (err) {
    console.log('    '+servoNumber,'configured.',err?err:'');
    // Set maxPWM
    servo.setDutyCycle(servoNumber, maxPWM, function (err) {
      console.log('    '+servoNumber,'max PWM set.',err?err:'');
      // setTimeout(function(){
        // Set minPWM
        servo.setDutyCycle(servoNumber, minPWM, function (err) {
          console.log('    '+servoNumber,'min PWM set.',err?err:'');
          // setTimeout(function(){ 
            console.log('    '+servoNumber,'armed.');
            // If this is the last motor to arm, have it invoke the callback.
            motors[servoNumber].armed = true;
            if(motors[1].armed && motors[2].armed && motors[3].armed && motors[4].armed){
              preflight.onMotorsArmed();
            } 
          // }, msBetweenMinPWMAndCallback);
        });
      // }, msBetweenMaxAndMinPWM);
    });
  });
};
=======
// Motor calibrations

var Motor = function(motorNumber){
  this.number = motorNumber;
  this.currentThrottle = 0;
  this.setThrottle = setThrottle
}
>>>>>>> 961be282f7c1b034e27a60b61be85c963af0f553

var motors = {
  1: new Motor(1),
  2: new Motor(2),
  3: new Motor(3),
  4: new Motor(4)
};
// e.g. motors[1].setThrottle(.2);
function setThrottle(throttle){
  //TODO 'this' probably not correct.
  var motor = this;
  var previousThrottle = motor.currentThrottle;
  var averageThrottle = ((motors[1].currentThrottle + motors[2].currentThrottle + motors[3].currentThrottle + motors[4].currentThrottle)/4)
  motor.currentThrottle = throttle;
  if(Math.max(motors[1].currentThrottle, motors[2].currentThrottle, motors[3].currentThrottle, motors[4].currentThrottle) - Math.min(motors[1].currentThrottle, motors[2].currentThrottle, motors[3].currentThrottle, motors[4].currentThrottle) <= maxThrottleDifference){
    servo.move(this.number, throttle, function(err){
      motor.currentThrottle = throttle;
      staticLog(motors[1].currentThrottle, motors[2].currentThrottle, motors[3].currentThrottle, motors[4].currentThrottle);
    });
  } else if(Math.abs(previousThrottle - averageThrottle) > Math.abs(motor.currentThrottle - averageThrottle)){
      console.log('outta bounds - moving towards average')
      servo.move(this.number, throttle, function(err){
        motor.currentThrottle = throttle;
        staticLog(motors[1].currentThrottle, motors[2].currentThrottle, motors[3].currentThrottle, motors[4].currentThrottle);
      })
  } else {
    motor.currentThrottle = previousThrottle;
  }
}

// exports.setThrottle = setThrottle;
exports.motors = motors;
exports.colorGreen = colorGreen;
exports.checkMark = checkMark;
// exports.colorRed =  colorRed;
exports.colorWhite =  colorWhite;
exports.accelReadsPerSecond = accelReadsPerSecond;
exports.accelMaxGs = accelMaxGs;
exports.accelThresholdBeforeBalancing = accelThresholdBeforeBalancing;
exports.isLanding = isLanding;
exports.isHovering = isHovering;
exports.motorMaxThrottle = motorMaxThrottle;
exports.minThrottleIncrement = minThrottleIncrement;
exports.accelerometer = accel;
exports.accelData = accelData;
