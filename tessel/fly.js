'use strict';

/*  One file to rule them all,
 *  one file to find them.
 *  One file to bring them all,
 *  and in the darkness fly them. 
 */

/*  Performance testing:
 *  Date.now() +10ms
 *  PID() +5ms
 *  console.logging +85ms
 *  accel.on('data') +???ms
 *  servo.move() +???ms
 */


// var accelResolution = 0.0;

var pct2PWM = function pct2PWM(percent){
  // 100% -> .125
  // 0% -> .002
  var max = 0.125;
  var min = 0.002;
  var pwm = percent*(max-min)/100+min;
  return pwm;
};

var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['C'])
var servo = require('servo-pca9685').use(tessel.port['A']);

var motor1Throttle = 0;
var motor2Throttle = 0;
var motor3Throttle = 0;
var motor4Throttle = 0;
// This might not need to be global.
var maxThrottle = 50;


/************************************************
 * Calculate Accelerator Offsets, professionally.
 ***********************************************/
var calculateAverages = function calculateAverages(accelArray){
  var x = 0;
  var y = 0;
  for(var i = 0; i< accelArray.length; i++){
    x += accelArray[i][0];
    y += accelArray[i][1];
  }
  
  var accelerometer = {
    x: x/accelArray.length,
    y: y/accelArray.length,
  }

  console.log('acceleratorOffsets:', accelerometer);

  return accelerometer;
};

var prevErrorX = 0;
var prevErrorY = 0;
var sumErrorsX = 0;
var sumErrorsY = 0;
// How to initialize?
var prevGlobTime;

/*******************
 * PID CALCULUS HELL 
 *******************/

var PID = function PID(errorX, errorY) {
  var PROPORTION = 10; //* error
  var INTEGRATION = -1; //* sumErrors (= error * deltaTime)
  var DERIVATION = 1; //* deltaError / deltaTime

  // Calculate time elapsed since previous calculation.
  var time = Date.now(); // Getting the time delta takes ~10ms
  // in seconds, not ms.
  var deltaTime = (time - prevGlobTime)/1000;
  prevGlobTime = time; //TODO rename

  // Add current error to sum of errors.
  // Fix this - reason for this current condition is time will evaluate high the first call through
  if (Math.abs(deltaTime) < 10000000){
    sumErrorsX += errorX * deltaTime;
    sumErrorsY += errorY * deltaTime;
  }

  var deltaErrorX = errorX - prevErrorX;
  var Px = PROPORTION * errorX;
  var Ix = INTEGRATION * sumErrorsX;
  var Dx = DERIVATION * deltaErrorX / deltaTime;
  var PIDx = Px + Ix + Dx; 

  var deltaErrorY = errorY - prevErrorY;
  var Py = PROPORTION * errorY;
  var Iy = INTEGRATION * sumErrorsY; // O(10's)
  var Dy = DERIVATION * deltaErrorY / deltaTime;
  var PIDy = Py + Iy + Dy; 

  prevErrorX = errorX;
  prevErrorY = errorY; 

  correction = {
    1: -1*PIDx/2,
    2: PIDx/2,
    3: PIDy/2,
    4: -1*PIDy/2,
    // logging
    deltaTime: deltaTime,
    Px: Px,
    Py: Py,
    Ix: Ix,
    Iy: Iy,
    Dx: Dx,
    Dy: Dy,
  };

  return correction;
};

var isServoModuleReady = false;
servo.on('ready', function(){
  console.log('Servo module ready.')
  isServoModuleReady = true;
});

/*******************
 * CALIBRATE ACCEL 
 *******************/

// DON'T FUCKING CHANGE THIS vv ANYONE!
var accelReadsPerSecond = 12.5;
var accelMaxGs = 2;
var isAccelModuleReady = false;
var accelerometerOffsets = false;
var preflightAccelDataCollection = [];
accel.on('ready', function () {
  accel.on( 'error', function(err){
    console.log('NOOOOOOO!', err);
  });

  console.log('Accel module ready');
  accel.setOutputRate( accelReadsPerSecond, function(err){
    accel.setScaleRange( accelMaxGs, function(err){

      // Get values for accelerometer calibration.
      (function calibrate(){
        accel.getAcceleration(function(err, xyz){
          if (err) console.log(err);
          console.log('Calibrating accelerometer...');
          preflightAccelDataCollection.push(xyz);  
          if(!accelerometerOffsets) calibrate();
        });
        if (preflightAccelDataCollection.length === 50){
          console.log('Calculating accelerometer offsets...');
          accelerometerOffsets = calculateAverages(preflightAccelDataCollection);
          isAccelModuleReady = true;
        }
      })();
    });
  });
});

var userReady = false;
var checkModules = function checkModules(){
  // Continue looping until the user is ready.
  setImmediate(function(){
    if (isAccelModuleReady && isServoModuleReady){ 
      console.log('Calibrate ESC now (100 enter 0 enter 2 enter)');
      process.stdin.resume();
      servo.configure(1, 0, 1, function(){
        process.stdin.on('data', function (percent) {
          percent = parseInt(percent);
          var pwm = pct2PWM(percent);
          if (percent >= 0){
            console.log('pwm',pwm);
            servo.move(1, pwm);
            motor1Throttle = percent;
            servo.configure(2, 0, 1, function(){
              servo.move(2, pwm);
              motor2Throttle = percent;
            });
            servo.configure(3, 0, 1, function(){
              servo.move(3, pwm);
              motor3Throttle = percent;
            });
            servo.configure(4, 0, 1, function(){
              servo.move(4, pwm);
              motor4Throttle = percent;
            });
          } else {
            userReady = true;
          }
        });
      });   
    } else {
      checkModules();
    }
  })
};

var checkIfReadyToLaunch = function checkIfReadyToLaunch(){
  // Loop until user is ready.
  setImmediate(function(){
    if (userReady){
      console.log('user ready')
      launch();
    } else {
      checkIfReadyToLaunch();
    }
  })
};

// Might not need to be global?
var currentlyMoving = 0;

/*******************
 * onDATA and MOTORS 
 *******************/

var launch = function launch(){
  accel.on('data', function(xyz){
    // if (!currentlyMoving){
      currentlyMoving = 0;
      // Calculate throttle corrections.
      var errorX = xyz[0]-accelerometerOffsets.x;
      var errorY = xyz[1]-accelerometerOffsets.y;
      // errorX = Math.abs(errorX) < accelResolution ? 0 : errorX;
      // errorY = Math.abs(errorY) < accelResolution ? 0 : errorY;

      var correction = PID( errorX, errorY );
      console.log('\ncalibrated errorX', errorX, 'calibrated errorY', errorY, 'deltaTime', correction.deltaTime, '\n'+
        'Px', correction.Px.toFixed(3), 'Ix', correction.Ix.toFixed(3), 'Dx', correction.Dx.toFixed(3), 'sumErrorsX', sumErrorsX.toFixed(3),  '\n'+
        'Py', correction.Py.toFixed(3), 'Iy', correction.Iy.toFixed(3), 'Dy', correction.Dy.toFixed(3), 'sumErrorsY', sumErrorsY.toFixed(3), '\n'+
        '1+X: throttle', motor1Throttle.toFixed(3), 'correction', correction[1].toFixed(3), '\n'+
        '2-X: throttle', motor2Throttle.toFixed(3), 'correction', correction[2].toFixed(3), '\n'+
        '3-Y: throttle', motor3Throttle.toFixed(3), 'correction', correction[3].toFixed(3), '\n'+
        '4+Y: throttle', motor4Throttle.toFixed(3), 'correction', correction[4].toFixed(3));        
      // Move each motor.
      if ( motor1Throttle + correction[1] >= 0 && motor1Throttle + correction[1] <= maxThrottle){
        setImmediate(function(){
          servo.move(1, pct2PWM( motor1Throttle + correction[1] ), function(){
            motor1Throttle = motor1Throttle + correction[1];
            currentlyMoving === 3 ? currentlyMoving = 0 : currentlyMoving++;
          });
        });
      } else {
        currentlyMoving === 3 ? currentlyMoving = 0 : currentlyMoving++;
      }
      if ( motor2Throttle + correction[2] >= 0 && motor2Throttle + correction[2] <= maxThrottle){
        setImmediate(function(){
          servo.move(2, pct2PWM( motor2Throttle + correction[2] ), function(){
            motor2Throttle = motor2Throttle + correction[2];
            currentlyMoving === 3 ? currentlyMoving = 0 : currentlyMoving++;
          });
        });
      } else {
        currentlyMoving === 3 ? currentlyMoving = 0 : currentlyMoving++;
      }
      if ( motor3Throttle + correction[3] >= 0 && motor3Throttle + correction[3] <= maxThrottle){
        setImmediate(function(){
          servo.move(3, pct2PWM( motor3Throttle + correction[3] ), function(){
            motor3Throttle = motor3Throttle + correction[3];
            currentlyMoving === 3 ? currentlyMoving = 0 : currentlyMoving++;
          });
        });
      } else {
        currentlyMoving === 3 ? currentlyMoving = 0 : currentlyMoving++;
      }
      if ( motor4Throttle + correction[4] >= 0 && motor4Throttle + correction[4] <= maxThrottle){
        setImmediate(function(){
          servo.move(4, pct2PWM( motor4Throttle + correction[4] ), function(){
            motor4Throttle = motor4Throttle + correction[4];
            currentlyMoving === 3 ? currentlyMoving = 0 : currentlyMoving++;
          });
        });
      } else {
        currentlyMoving === 3 ? currentlyMoving = 0 : currentlyMoving++;
      }
    // }
  });
};

checkModules();
checkIfReadyToLaunch();
