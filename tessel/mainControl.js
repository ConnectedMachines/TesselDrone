var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['D'])
var servo = require('servo-pca9685').use(tessel.port['A']);

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
var throttleIncrement = 0.0005;
var maxThrottleDifference = 0.004;

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
var targetBalance = 0.009;

// Log data to console to monitor motor speed/average speed/accelerometer reads
var colorGreen = '\033[92m';
var checkMark = '\u2714';
var colorRed = '\033[91m';
var colorWhite = '' //'\033[97m';
var lobot = {
  x: {
    error: undefined,
    dError: undefined,
    dTime: undefined,
    P: undefined,
    I: undefined,
    D: undefined,
    correction: undefined
  },
  y: {
    error: undefined,
    dError: undefined,
    dTime: undefined,
    P: undefined,
    I: undefined,
    D: undefined,
    correction: undefined
  }
};
var showStaticLog = function(){
  process.stdout.write('\u001B[2J\u001B[0;0f'
    +'Motors:\n'
    +'  1+x: '+motors[1].currentThrottle.toFixed(3)+'\n'
    +'  2-x: '+motors[2].currentThrottle.toFixed(3)+'\n'
    +'  3-y: '+motors[3].currentThrottle.toFixed(3)+'\n'
    +'  4+y: '+motors[4].currentThrottle.toFixed(3)+'\n'
    +'  avg: '+((motors[1].currentThrottle+motors[2].currentThrottle+motors[3].currentThrottle+motors[4].currentThrottle)/4).toFixed(3)+'\n'
    +'X:'+'\n'
    +'  error: '+lobot.x.error+'\n'
    +'  ∆error: '+lobot.x.dError+'\n'
    +'  ∆time: '+lobot.x.dTime+'\n'
    +'  P: '+lobot.x.P+'\n'
    +'  I: '+lobot.x.I+'\n'
    +'  D: '+lobot.x.D+'\n'
    +'  PID: '+lobot.x.correction+'\n'
    +'Y:'+'\n'
    +'  error: '+lobot.y.error+'\n'
    +'  ∆error: '+lobot.y.dError+'\n'
    +'  ∆time: '+lobot.y.dTime+'\n'
    +'  P: '+lobot.y.P+'\n'
    +'  I: '+lobot.y.I+'\n'
    +'  D: '+lobot.y.D+'\n'
    +'  PID: '+lobot.y.correction+'\n'
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

var preflightAccelDataCollection = [];

var calculateAverages = function(accelArray){
  var x = 0;
  var y = 0;
  var z = 0;
  for(var i = 0; i< accelArray.length; i++){
    x += accelArray[i][0];
    y += accelArray[i][1];
    z += accelArray[i][2];
  }
  
  var accelerometer = {
    x: x/accelArray.length,
    y: y/accelArray.length,
    z: z/accelArray.length
  }

  console.log('acceleratorOffsets:', accelerometer);

  return accelerometer;
}

var accelerometerOffsets = {};

accel.on('data', function(xyz){
  if(preflightAccelDataCollection.length < 50){
    preflightAccelDataCollection.push(xyz);
    if(preflightAccelDataCollection.length === 50){
      accelerometerOffsets = calculateAverages(preflightAccelDataCollection);
    }
  }

  error['x'] = Math.abs(xyz[0] - accelerometerOffsets['x']) < targetBalance ?  0 : xyz[0] - accelerometerOffsets['x'];
  error['y'] = Math.abs(xyz[1] - accelerometerOffsets['y']) < targetBalance ?  0 : xyz[1] - accelerometerOffsets['y'];
  error['z'] = Math.abs(xyz[2] - accelerometerOffsets['z']) < targetBalance ?  0 : xyz[2] - accelerometerOffsets['z'];
  accelData = xyz;
});



// e.g. motors[1].setThrottle(.2, 'x');
function setThrottle(throttle, axis){
  // console.log('throttle ',throttle);
  // console.log('errorX ',error['x']);
  // console.log('errorY ',error['y']);
  // console.log('errorZ ',error['y']);
  var motor = this;
  var previousThrottle = motor.currentThrottle;
  var averageThrottle = ((motors[1].currentThrottle + motors[2].currentThrottle + motors[3].currentThrottle + motors[4].currentThrottle)/4)
  motor.currentThrottle = throttle;
  if(Math.max(motors[1].currentThrottle, motors[2].currentThrottle, motors[3].currentThrottle, motors[4].currentThrottle) - Math.min(motors[1].currentThrottle, motors[2].currentThrottle, motors[3].currentThrottle, motors[4].currentThrottle) <= maxThrottleDifference){
    servo.move(this.number, throttle, function(err){
      motor.currentThrottle = throttle;
      showStaticLog();
    });
  } else if(Math.abs(previousThrottle - averageThrottle) > Math.abs(motor.currentThrottle - averageThrottle)){
    console.log('outta bounds - moving towards average')
    servo.move(this.number, throttle, function(err){
      motor.currentThrottle = throttle;
      showStaticLog();
    })
  } else {
    console.log('Not valid throttle input.');
    motor.currentThrottle = previousThrottle;
  }
  axisChanging[axis] = false;
};

exports.lobot = lobot; // Logging god object; resides on Cloud City.
exports.servo = servo;
exports.accel = accel;
exports.motors = motors;
exports.targetBalance = targetBalance
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
exports.proportionConstant = proportionConstant  
exports.integrationConstant = integrationConstant 
exports.derivationConstant = derivationConstant
