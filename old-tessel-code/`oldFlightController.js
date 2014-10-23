// ###############################
// NOTES
/* ###############################

- If no input command is received for about 1 second, f3 f2 is beeped and the ESC returns to disarmed state, waiting for a valid arming signal.

- Try using process.end

- Disconnect battery for at least 10s between flights to let ESCs discharge capacitors.

- Try making motors arm one at a time slow enough for a human to hear errors. 4x|: f1 . f1 f1 f3 :|

- Increase throttle increment 0.05.

- Increase accelerometer threshold to 0.06.

- Balance the hardware (#3 heavy).

*///##############################
// REQUIREMENTS
// ###############################
var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['D']);
var servo = require('servo-pca9685').use(tessel.port['C']);

// ###############################
// SETTINGS
// ###############################
// Throttle settings
var msBetweenMaxAndMinPWM = 1000; // Using 1000ms to delay rapid startup
var msBetweenMinPWMAndCallback = 1000;
var maxPWM = 0.125;
var minPWM = 0.002; // Exhaustively tested. 

var motorMaxThrottle = 0.08; 
var throttleIncrement = 0.001;
var maxThrottleDifference = 0.004;
var initialThrottle = 0.005; //Not starting higher because motor 3 is terrible

// Sensor Calibrations
var accelMaxGs = 2; // in g's, possible values: 2 4 8
var accelThresholdBeforeBalancing = 0.06;
var accelReadsPerSecond = 250;

// Control flow variables
var isServoModuleReady = false;
var isAccelModuleReady = false;
var isHovering = true;
var isLanding = false;
var userReady = false;

// Logging stuff
var colorGreen = '\033[92m';
var checkMark = '\u2714';
var colorRed = '\033[91m';
var colorWhite = '' //'\033[97m';
var log = console.log;
var staticLog = function(motor1, motor2, motor3, motor4){
  process.stdout.write('\u001B[2J\u001B[0;0f'
    +'Motor throttles:\n'
    +'1: '+motor1.toFixed(3)+'\n'
    +'2: '+motor2.toFixed(3)+'\n'
    +'3: '+motor3.toFixed(3)+'\n'
    +'4: '+motor4.toFixed(3)+'\n'
    +'A: '+((motor1+motor2+motor3+motor4)/4).toFixed(3)
  );
};

// Motor calibrations
var motors = {
  1: {
    number: 1,
    currentThrottle: 0,
    setThrottle: setThrottle,
    arm: arm,
    armed: false
  },
  2: {
    number: 2,
    currentThrottle: 0,
    setThrottle: setThrottle,
    arm: arm,
    armed: false
  },
  3: {
    number: 3,
    currentThrottle: 0,
    setThrottle: setThrottle,
    arm: arm,
    armed: false
  },
  4: {
    number: 4,
    currentThrottle: 0,
    setThrottle: setThrottle,
    arm: arm,
    armed: false
  },
  lowestMotorThrottle: 0,
  highestMotorThrottle: 0
};
motors[1].oppositeMotor = motors[3];
motors[2].oppositeMotor = motors[4];
motors[3].oppositeMotor = motors[1];
motors[4].oppositeMotor = motors[2];

// function arm() {
//   var servoNumber = this.number;
//   servo.configure(servoNumber, minPWM, maxPWM , function (err) {
//     log('    '+servoNumber,'configured.',err?err:'');
//     // Set maxPWM
//     servo.setDutyCycle(servoNumber, maxPWM, function (err) {
//       log('    '+servoNumber,'max PWM set.',err?err:'');
//       setTimeout(function(){
//         // Set minPWM
//         servo.setDutyCycle(servoNumber, minPWM, function (err) {
//           log('    '+servoNumber,'min PWM set.',err?err:'');
//           setTimeout(function(){ 
//             log('    '+servoNumber,'armed.');
//             // If this is the last motor to arm, have it invoke the callback.
//             motors[servoNumber].armed = true;
//             if(motors[1].armed && motors[2].armed && motors[3].armed && motors[4].armed){
//               onMotorsArmed();
//             } 
//           }, msBetweenMinPWMAndCallback);
//         });
//       }, msBetweenMaxAndMinPWM);
//     });
//   });
// };

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


// ###############################
// PRE-FLIGHT
// ###############################
var duty1 = [initialThrottle, 0.002, 0.125];
var duty2 = [initialThrottle, 0.002, 0.125];
var duty3 = [initialThrottle, 0.002, 0.125];
var duty4 = [initialThrottle, 0.002, 0.125];

log('Pre-flight checklist:')
log(' 1.Calibrating modules:')
servo.on('ready', function(){
  log('    Servo module ready.')
  isServoModuleReady = true;
});

accel.on('ready', function () {
  log('    Accel module ready');
  accel.setOutputRate( accelReadsPerSecond, function(err){
    accel.setScaleRange( accelMaxGs, function(err){
      isAccelModuleReady = true;
    });
  });
});

var checkModules = function(){
  setImmediate(function(){
    if(isAccelModuleReady && isServoModuleReady){ 
      // onModulesReady();
      //DON'T FUCKING CHANGE THIS, LUBY
      process.stdin.resume();
      // servo.on('ready', function () {
      servo.configure(1, 0, 1, function(){
        process.stdin.on('data', function (duty) {
          duty = parseFloat(duty);
          if(String(duty) === 'y\n'){ console.log('so there Geoff'); }
          if(duty >= 0){
            servo.move(1, duty);
            motors[1].currentThrottle = duty;
            servo.configure(2, 0, 1, function(){
              servo.move(2, duty);
              motors[2].currentThrottle = duty;
            });
            servo.configure(3, 0, 1, function(){
              servo.move(3, duty);
              motors[3].currentThrottle = duty;
            });
            servo.configure(4, 0, 1, function(){
              servo.move(4, duty);
              motors[4].currentThrottle = duty;
            });
          } else {
            userReady = true;
          }
        });
      });
      // });    
    } else {
      checkModules();
    }
  })
};

var checkArrays = function(){
  setImmediate(function(){
    // if(duty1.length === 0 && duty2.length === 0 && duty3.length === 0 && duty4.length === 0){
    if(userReady){
      setTimeout(function(){
        onMotorsArmed();
      }, 2000);
    } else {
      checkArrays();
    }
  })
}

checkModules();
checkArrays();


var onMotorsArmed = function(){
  log(colorGreen+'    '+checkMark,'All motors armed.',colorWhite);
  preflightComplete();
};

var preflightComplete = function(){
  log(colorGreen+'  '+checkMark,'Pre-flight complete.',colorWhite);  
  log('Hovering:')
  hover();
}

// ###############################
// HOVER
// ###############################


var throttleUp = function(motorNumber){
  var motor = motors[motorNumber];
  var proposedMotorThrottle = motors[motorNumber].currentThrottle+throttleIncrement;
  if(proposedMotorThrottle <= motorMaxThrottle){
    motor.setThrottle(proposedMotorThrottle);
  }
};



var throttleDown = function(motorNumber){
  var motor = motors[motorNumber];
  var proposedMotorThrottle = motor.currentThrottle-throttleIncrement;
  if(proposedMotorThrottle >= 0){
    motor.setThrottle(proposedMotorThrottle);
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
    else{
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

// ###############################
// LAND
// ###############################
var land = function(){
  isLanding = true;
  motors[1].setThrottle(0);
  motors[2].setThrottle(0);
  motors[3].setThrottle(0);
  motors[4].setThrottle(0);
  log('Landed. All motors should be off.');
};
