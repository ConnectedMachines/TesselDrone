var tessel = require('tessel');    
var accel = require('accel-mma84').use(tessel.port['D']);    
var servo = require('servo-pca9685').use(tessel.port['C']);    
   
// If no input command is received for about 1 second, f3 f2 is beeped and the ESC returns to disarmed state, waiting for a valid arming signal.   
// try using process.end   
   
// Motor calibrations    
var motors = {   
  1: {   
    motor: 1,    
    throttle: 0,   
    armed: false   
  },   
  2: {   
    motor: 2,    
    throttle: 0,   
    armed: false   
  },   
  3: {   
    motor: 3,    
    throttle: 0,   
    armed: false   
  },   
  4: {   
    motor: 4,    
    throttle: 0,   
    armed: false   
  }    
};   
motors['1'].oppositeMotor = motors['3'];   
motors['2'].oppositeMotor = motors['4'];   
motors['3'].oppositeMotor = motors['1'];   
motors['4'].oppositeMotor = motors['2'];   
   
var startupTime = msBetweenMaxAndMinPWM = msBetweenMinPWMAndCallback = 1000; // Using 1000ms to delay rapid startup    
var maxPWM = 0.125;    
var minPWM = 0.002; // Exhaustively tested.    
   
var userSetMaxThrottle = 0.05; // 5%   
var minThrottleIncrement = 0.002;    
var motorMaxThrottle = userSetMaxThrottle;     
var maxDifferenceBetweenAxes = 0.1;    
   
// Sensor Calibrations   
var accelMaxGs = 2; // in g's, possible values: 2 4 8    
var accelThresholdBeforeBalancing = 0.03;    
var accelReadsPerSecond = 250;   
   
// Control flow variables    
var isServoModuleReady = false;    
var isAccelModuleReady = false;    
var isHovering = true;   
var isLanding = false;   
   
// servo.setModuleFrequency(0, function(err){    
  // console.log('servo.setModuleFrequency 0',err);    
  servo.on('ready', function(){    
    console.log('servo ready');    
    // Set motors to zero for safety:    
    // try setting module freq to zero to start    
    // setTimeout(function(){servo.move(4, 0);},100);    
    // setTimeout(function(){servo.move(3, 0);},200);    
    // setTimeout(function(){servo.move(2, 0);},300);    
    // setTimeout(function(){servo.move(1, 0);},400);    
   
    isServoModuleReady = true;   
    if(isAccelModuleReady && isServoModuleReady){    
      onModulesReady();    
    }    
  });    
// }); // from setModFreq    
   
accel.on('ready', function () {    
  accel.setOutputRate( accelReadsPerSecond, function(err){   
    accel.setScaleRange( accelMaxGs, function(err){    
      isAccelModuleReady = true;   
      if(isAccelModuleReady && isServoModuleReady){    
        onModulesReady();    
      }    
    });    
  });    
});    
   
var onModulesReady = function(){   
  // process.stdin.resume();   
  // currentQuestion = 'Are motors already armed from previous test?';     
  // console.log(currentQuestion,'[y/n]');   
  // process.stdin.on('data', function (userInput) {   
    // servo.setModuleFrequency(50, function(err){ console.log('servo.setModuleFrequency 50 (default)',err) };   
   
    // if(false){//'y' === String(userInput)[0] && currentQuestion === 'Are motors already armed from previous test?'){    
      // onMotorsArmed();    
    // } else{// if('n' === String(userInput)[0] && currentQuestion === 'Are motors already armed from previous test?'){   
      setTimeout(function(){   
        armMotor(1);   
      },1000);   
      setTimeout(function(){   
        armMotor(2);   
      },1250);   
      setTimeout(function(){   
        armMotor(3);   
      },1500);   
      setTimeout(function(){   
        armMotor(4);   
      },1500);   
    // }   
  // });   
};   
   
var onMotorsArmed = function(){    
  console.log('All motors armed.');    
  hover();   
};   
   
// Hover code:   
var throttleUp = function(motorNumber){    
  var proposedMotorThrottle = motors[motorNumber].throttle+minThrottleIncrement;   
  if(proposedMotorThrottle <= motorMaxThrottle){   
    // var timeMotorThrottleChangeIssued = new Date().getTime();   
    servo.move(motorNumber, proposedMotorThrottle, function(err){    
     //  var timeMotorThrottleChangeCompleted = new Date().getTime();    
     //  var timeToIssueThrottleChange =timeMotorThrottleChangeCompleted-timeMotorThrottleChangeIssued;    
     //  if(err){console.log(timeToIssueThrottleChange,motorNumber,err);}    
     //  else{   
     //    // if left in to allow single motor logging.    
     //    motors[motorNumber].throttle = proposedMotorThrottle;   
     //    if(motorNumber !== 0){console.log(motorNumber+' ^ '+proposedMotorThrottle, timeToIssueThrottleChange, 'ms');}   
     //  }   
     // }*/    
      motors[motorNumber].throttle = proposedMotorThrottle;    
      console.log(motorNumber+' ^ '+proposedMotorThrottle);    
    });    
  }    
};   
var throttleDown = function(motorNumber){    
  var proposedMotorThrottle = motors[motorNumber].throttle-minThrottleIncrement;   
  if(proposedMotorThrottle >= 0){    
    // var timeMotorThrottleChangeIssued = new Date().getTime();   
    servo.move(motorNumber, proposedMotorThrottle, function(err){    
      // var timeMotorThrottleChangeCompleted = new Date().getTime();    
      // var timeToIssueThrottleChange =timeMotorThrottleChangeCompleted-timeMotorThrottleChangeIssued;    
      // if(err){console.log(timeToIssueThrottleChange,motorNumber,err);}    
      // else{   
      //   // if left in to allow single motor logging.    
      //   if(motorNumber !== 0){console.log(motorNumber+' v '+proposedMotorThrottle, timeToIssueThrottleChange, 'ms');}   
      motors[motorNumber].throttle = proposedMotorThrottle;    
      console.log(motorNumber+' v '+proposedMotorThrottle);    
      // }   
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
    else if(Math.abs(evenAxisAverageThrottle-oddAxisAverageThrottle) < maxDifferenceBetweenAxes){ // when balanced, increase throttles to max.   
      throttleUp(posMotor);    
      throttleUp(negMotor);    
    }    
  }    
  var oddAxisAverageThrottle = (motors[1].throttle+motors[3].throttle)/2;    
  var evenAxisAverageThrottle = (motors[2].throttle+motors[4].throttle)/2;   
   
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
   
var land = function(){   
  isLanding = true;    
  servo.move(1, 0);    
  servo.move(2, 0);    
  servo.move(3, 0);    
  servo.move(4, 0);    
  console.log('Landed. All motors should be off.');    
};   
   
var armMotor = function (servoNumber) {    
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
            motors[servoNumber].armed = true;    
            if(motors[1].armed && motors[2].armed && motors[3].armed && motors[4].armed){    
              onMotorsArmed();   
            }    
          }, msBetweenMinPWMAndCallback);    
        });    
      }, msBetweenMaxAndMinPWM);   
    });    
  });    
};