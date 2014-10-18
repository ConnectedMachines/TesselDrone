'use strict';

var http = require('http');
var tessel = require('tessel');
var wifi = require('wifi-cc3000');
var accel = require('accel-mma84').use(tessel.port['C'])
var servo = require('servo-pca9685').use(tessel.port['A']);

var greenLED = tessel.led[0];
var blueLED = tessel.led[1];
var redLED = tessel.led[2];
var yellowLED = tessel.led[3];

if(wifi.isConnected()){ 
  startServerEtAl(); 
}
wifi.on('connect', function (err, data) {
  startServerEtAl();
});

// Once wifi connected, start the server and listen for cURL commands.
// /100 /0 /2 /hover
function startServerEtAl(){
  http.createServer(function (req, res) {
    blueLED.toggle();
    console.log('\nRequest received', req.url);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    
    var command = req.url.slice(1);
    console.log('command is', command);

    command == 'hover' ? hover() : setPWM(Number(command));

    res.end(' OK.');
    blueLED.toggle();
  }).listen(9000);
  console.log('Server started.');
  yellowLED.low();
  blueLED.high();

  function setPWM(command){
    var percent = command;
    var pwm = pct2PWM(percent);
    console.log('Setting throttles to '+percent+'%, '+pwm+'PWM');
    servo.configure(1, 0, 1, function(){
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
    });
    return 'Throttles set to '+command+'%, '+pwm+'PWM';
  };

  var userReady = false;

  var hover = function hover(){
    console.log('User ready.');
    redLED.high();
    userReady = true;
    isEverythingReady();
  };

  var pct2PWM = function pct2PWM(percent){
    // 100% -> .125
    // 0% -> .002
    var max = 0.125;
    var min = 0.002;
    var pwm = percent*(max-min)/100+min;
    return pwm;
  };

  var motor1Throttle = 0;
  var motor2Throttle = 0;
  var motor3Throttle = 0;
  var motor4Throttle = 0;
  // This might not need to be global.
  var maxThrottle = 100;

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
   * PID 
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
    greenLED.high();
    isServoModuleReady = true;
    isEverythingReady();
  });

  /*******************
   * CALIBRATE ACCEL 
   *******************/

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
              preflightAccelDataCollection.push(xyz);  
            if(!accelerometerOffsets) calibrate();
          });
          if (preflightAccelDataCollection.length === 50){
            console.log('Calculating accelerometer offsets...');
            accelerometerOffsets = calculateAverages(preflightAccelDataCollection);
            yellowLED.high();
            isAccelModuleReady = true;
            isEverythingReady();
          }
        })();
      });
    });
  });

  var isEverythingReady = function isEverythingReady(){
    if (isAccelModuleReady && isServoModuleReady && userReady){
      console.log('Everything\'s ready, launching!')
      launch();
    }
  };

  /*******************
   * onDATA and MOTORS 
   *******************/

  var launch = function launch(){
    accel.on('data', function(xyz){
      // Calculate throttle corrections.
      var errorX = xyz[0]-accelerometerOffsets.x;
      var errorY = xyz[1]-accelerometerOffsets.y;
      var correction = PID( errorX, errorY );
      // Move each motor.
      if ( motor1Throttle + correction[1] >= 0 && motor1Throttle + correction[1] <= maxThrottle){
        servo.move(1, pct2PWM( motor1Throttle + correction[1] ), function(){
          motor1Throttle = motor1Throttle + correction[1];
          currentlyMoving === 3 ? currentlyMoving = 0 : currentlyMoving++;
        });
      }
      if ( motor2Throttle + correction[2] >= 0 && motor2Throttle + correction[2] <= maxThrottle){
        servo.move(2, pct2PWM( motor2Throttle + correction[2] ), function(){
          motor2Throttle = motor2Throttle + correction[2];
          currentlyMoving === 3 ? currentlyMoving = 0 : currentlyMoving++;
        });
      }
      if ( motor3Throttle + correction[3] >= 0 && motor3Throttle + correction[3] <= maxThrottle){
        servo.move(3, pct2PWM( motor3Throttle + correction[3] ), function(){
          motor3Throttle = motor3Throttle + correction[3];
          currentlyMoving === 3 ? currentlyMoving = 0 : currentlyMoving++;
        });
      }
      if ( motor4Throttle + correction[4] >= 0 && motor4Throttle + correction[4] <= maxThrottle){
        servo.move(4, pct2PWM( motor4Throttle + correction[4] ), function(){
          motor4Throttle = motor4Throttle + correction[4];
          currentlyMoving === 3 ? currentlyMoving = 0 : currentlyMoving++;
        });
      }
    });
  };
}