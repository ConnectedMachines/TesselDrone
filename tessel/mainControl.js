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
var accelReadsPerSecond = 350;

// Control flow variables
var isServoModuleReady = false;
var isAccelModuleReady = false;
var isHovering = false;
var isLanding = false;
var userReady = false;

//PID Constants
var proportionConstant = 0.005; //?
var integrationConstant = 0.00025; //? Mike thinks it should be negative.
var derivationConstant = 0.001; //?
var targetBalance = 0.006;

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

// Motor calibrations
var Motor = function(motorNumber){
  this.number = motorNumber;
  this.currentThrottle = 0;
  this.setThrottle = setThrottle
}

var motors = {
  1: new Motor(1),
  2: new Motor(2),
  3: new Motor(3),
  4: new Motor(4)
};

var axisChanging = {
  x: false,
  y: false
};

var error = {
  x: 0,
  y: 0,
  z: 0
};

var previousError = {
  x: 0,
  y: 0,
  z: 0
};

var previousTime = {
  x: 0,
  y: 0,
  z: 0
};

var sumError = {
  x: 0,
  y: 0,
  z: 0
};

accel.on('data', function(xyz){
  accelData = xyz;
  error['x'] = Math.abs(xyz[0]) < targetBalance ?  0 : xyz[0];
  error['y'] = Math.abs(xyz[1]) < targetBalance ?  0 : xyz[1];
  error['z'] = Math.abs(xyz[2]) < targetBalance ?  0 : xyz[2];
});


// e.g. motors[1].setThrottle(.2, 'x');
function setThrottle(throttle, axis){
  var motor = this;
  var previousThrottle = motor.currentThrottle;
  var averageThrottle = ((motors[1].currentThrottle + motors[2].currentThrottle + motors[3].currentThrottle + motors[4].currentThrottle)/4)
  motor.currentThrottle = throttle;
  if(Math.max(motors[1].currentThrottle, motors[2].currentThrottle, motors[3].currentThrottle, motors[4].currentThrottle) - Math.min(motors[1].currentThrottle, motors[2].currentThrottle, motors[3].currentThrottle, motors[4].currentThrottle) <= maxThrottleDifference){
    servo.move(this.number, throttle, function(err){
      motor.currentThrottle = throttle;
      log('1: '+motors[1].currentThrottle.toFixed(3)); 
      log('2: '+motors[2].currentThrottle.toFixed(3)); 
      log('3: '+motors[3].currentThrottle.toFixed(3)); 
      log('4: '+motors[4].currentThrottle.toFixed(3));
      log('A: '+((motors[1].currentThrottle+motors[2].currentThrottle+motors[3].currentThrottle+motors[4].currentThrottle)/4).toFixed(3));
      log('X: '+accelData[0]);
      log('Y: '+accelData[1]); 
      showStaticLog();
    });
  } else if(Math.abs(previousThrottle - averageThrottle) > Math.abs(motor.currentThrottle - averageThrottle)){
    console.log('outta bounds - moving towards average')
    servo.move(this.number, throttle, function(err){
      motor.currentThrottle = throttle;
      log('1: '+motors[1].currentThrottle.toFixed(3)); 
      log('2: '+motors[2].currentThrottle.toFixed(3)); 
      log('3: '+motors[3].currentThrottle.toFixed(3)); 
      log('4: '+motors[4].currentThrottle.toFixed(3));
      log('A: '+((motors[1].currentThrottle+motors[2].currentThrottle+motors[3].currentThrottle+motors[4].currentThrottle)/4).toFixed(3));
      log('X: '+accelData[0]);
      log('Y: '+accelData[1]); 
      showStaticLog();
    })
  } else {
    console.log('Not valid throttle input.');
    motor.currentThrottle = previousThrottle;
  }
  axisChanging[axis] = false;
};


exports.servo = servo;
exports.accel = accel;
exports.motors = motors;
exports.axisChanging = axisChanging;
exports.error = error;
exports.previousError = previousError;
exports.previousTime = previousTime;
exports.sumError = sumError;
exports.accelReadsPerSecond = accelReadsPerSecond;
exports.accelMaxGs = accelMaxGs;
exports.isLanding = isLanding;
exports.isHovering = isHovering;
exports.motorMaxThrottle = motorMaxThrottle;
exports.minThrottleIncrement = minThrottleIncrement;
exports.accelData = accelData;
