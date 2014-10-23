// setTimeout(function(){
var http = require('http');
var tessel = require('tessel');
var hover = require('./hover.js')
var port = 8000;
var host = '10.8.14.248';
var accel = require('accel-mma84').use(tessel.port['D']);
var servo = require('servo-pca9685').use(tessel.port['C']);

// Motor calibrations
var motors = {
  1: {
    motor: 1,
    throttle: 0,
    configured: false
  },
  2: {
    motor: 2,
    throttle: 0,
    configured: false
  },
  3: {
    motor: 3,
    throttle: 0,
    configured: false
  },
  4: {
    motor: 4,
    throttle: 0,
    configured: false
  }
};
motors['1'].oppositeMotor = motors['3'];
motors['2'].oppositeMotor = motors['4'];
motors['3'].oppositeMotor = motors['1'];
motors['4'].oppositeMotor = motors['2'];

var startupTime = msBetweenMaxAndMinPWM = msBetweenMinPWMAndCallback = 1000; // Using 1000ms to delay rapid startup
var maxPWM = 0.125;
var minPWM = 0.002; // Exhaustively tested. 

var userSetMaxThrottle = 0.1;
var minThrottleIncrement = 0.02;
var maxOpposedThrottlesDifference = 0.10;
var motorMaxThrottle = userSetMaxThrottle; 

// Sensor Calibrations
var accelMaxGs = 2; // in g's, possible values: 2 4 8
var accelThresholdBeforeBalancing = 0.03;
var accelReadsPerSecond = 250;

var whatIsZero = motorMaxThrottle/2; //0.004;

// Control flow variables
var isServoModuleReady = false;
var isAccelModuleReady = false;
var isHovering = true;
var isLanding = false;
var modulesReady = false;

// Set motors to zero for safety:
servo.move(1, 0);
servo.move(2, 0);
servo.move(3, 0);
servo.move(4, 0);

servo.on('ready', function(){
  isServoModuleReady = true;
  if(isAccelModuleReady && isServoModuleReady){ 
    modulesReady = true;
  }
});

accel.on('ready', function () {
  accel.setOutputRate( accelReadsPerSecond, function(err){
    accel.setScaleRange( accelMaxGs, function(err){
      isAccelModuleReady = true;
      if(isAccelModuleReady && isServoModuleReady){ 
        modulesReady = true;
      }
    });
  });
});


var takeOff = function(){
  // Allow user to land immediately
  // process.stdin.resume();
  // process.stdin.on('data', function (throttle) {
  //   isHovering = false;
  //   console.log('User ordered immediate landing', String(throttle));
  // });
  if(modulesReady){
    setTimeout(function(){
      configureMotor(1, hover);
    },1000);
    setTimeout(function(){
      configureMotor(2, hover);
    },1250);
    setTimeout(function(){
      configureMotor(3, hover);
    },1500);
    setTimeout(function(){
      configureMotor(4, hover);
    },1750);
  }

// TODO placeholder for optimization.
// var onMotorsConfigured = function(){}; // ;)

// TODO consider as additional balancing measure.
// var checkMotorsArentTooFarApart = function(motor){}

  var throttleUp = function(motorNumber){
    var proposedMotorThrottle = motors[motorNumber].throttle+minThrottleIncrement;
    if(proposedMotorThrottle <= motorMaxThrottle){
      var timeMotorThrottleChangeIssued = new Date().getTime();
      servo.move(motorNumber, proposedMotorThrottle, function(err){
        var timeMotorThrottleChangeCompleted = new Date().getTime();
        var timeToIssueThrottleChange =timeMotorThrottleChangeCompleted-timeMotorThrottleChangeIssued;
        if(err){console.log(timeToIssueThrottleChange,motorNumber,err);}
        else{
          if(true){console.log(motorNumber+' ^ '+proposedMotorThrottle, timeToIssueThrottleChange);}
          motors[motorNumber].throttle = proposedMotorThrottle;
        }
      });
    }
  };

  var throttleDown = function(motorNumber){
    var proposedMotorThrottle = motors[motorNumber].throttle-minThrottleIncrement;
    if(proposedMotorThrottle >= 0){
      var timeMotorThrottleChangeIssued = new Date().getTime(); //nanoseconds
      servo.move(motorNumber, proposedMotorThrottle, function(err){
        var timeMotorThrottleChangeCompleted = new Date().getTime();
        var timeToIssueThrottleChange =timeMotorThrottleChangeCompleted-timeMotorThrottleChangeIssued;
        if(err){console.log(timeToIssueThrottleChange,motorNumber,err);}
        else{
          if(true){console.log(motorNumber+' v '+proposedMotorThrottle, timeToIssueThrottleChange);}
          motors[motorNumber].throttle = proposedMotorThrottle;
        }
      });
    }
  };

  var balanceAxis = function(axis, accelReading, callback){
    var balanceMotors = function(posMotor, negMotor){
      if(accelReading > accelThresholdBeforeBalancing){
        throttleDown(posMotor);
        throttleUp(negMotor);
      }
      else if(accelReading < -1 * accelThresholdBeforeBalancing){
        throttleDown(negMotor);
        throttleUp(posMotor);
      }
      else{ // when balanced, increase throttles to max.
        throttleUp(posMotor);
        throttleUp(negMotor);
      }
    } 
    if(axis === 'x'){
      balanceMotors(1,3);
    }
    if(axis === 'y'){
      balanceMotors(2,4);
    }
    callback();
  };

  var loopx = function(x){
    balanceAxis('x', x, function(){
      hover();
    });
  };

  var loopy = function(y){
    balanceAxis('y', y, function(){
      hover();
    });
  };

  var hover = function(){
    //Gets accelerometer data from accelerometer (xyz);
    accel.getAcceleration(function(err, xyz){ // TODO would rather use accel.on('data', callback(xyz));
      //if still isHovering - go through event loop
      if(isHovering){
        setTimeout(function(){
          loopx(xyz[0]);
        }, 0);

        setTimeout(function(){
          loopy(xyz[1]);
        }, 0);
      } else {
        if(!isLanding){
          land();
        }
      }
    });
  };
};
var land = function(){
  isLanding = true;
  servo.move(1, 0);
  servo.move(2, 0);
  servo.move(3, 0);
  servo.move(4, 0);
  console.log('Landed. All motors should be off.');
};

var configureMotor = function (servoNumber, callback) {
  console.log('Configuring motor '+servoNumber+'...');
  servo.configure(servoNumber, minPWM, maxPWM , function () {
    // Set maxPWM
    servo.setDutyCycle(servoNumber, maxPWM, function (err) {
      setTimeout(function(){
        // Set minPWM
        servo.setDutyCycle(servoNumber, minPWM, function (err) {
          setTimeout(function(){ 
            console.log(servoNumber+': ARMED');
            // If this is the last motor to arm, have it invoke the callback.
            motors[servoNumber].configured = true;
            if(motors[1].configured && motors[2].configured && motors[3].configured && motors[4].configured){
              callback();
            } 
          }, msBetweenMinPWMAndCallback);
        });
      }, msBetweenMaxAndMinPWM);
    });
  });
};

  // var gpio = tessel.port['GPIO'];


var server = http.createServer(function(req, res){

  // if(req.method === 'OPTIONS'){
  //   res.writeHead(200, headers);
  //   res.end();
  // }

  // if(req.method === 'GET' && req.url === '/preflight'){
  //   console.log('takingOff');
  //   // hover.preflight();
  //   var statusCode = 200;
  //   var endData ='on';
  // }    

  if(req.method === 'GET' && req.url === '/takeOff'){
    console.log('takingOff');
    takeOff();
    var statusCode = 200;
    var endData ='on';
  }

  if(req.method === 'GET' && req.url === '/land'){
    console.log('landing');
    land();
    var statusCode = 200;
    var endData = 'off';
  }

  var defaultCorsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
    "X-Requested-With": "*"
  };

  var headers = defaultCorsHeaders;
  res.writeHead(statusCode, headers);
  res.end(endData)
}).listen(port, host);


console.log('Tessel listening at http://', host, port);
// }, 60000)