// contains code related to an individual's motor params and methods

// Throttle settings
var msBetweenMaxAndMinPWM = 1000; // Using 1000ms to delay rapid startup
var msBetweenMinPWMAndCallback = 1000;
var maxPWM = 0.125;
var minPWM = 0.002; // Exhaustively tested. 

var motorMaxThrottle = 0.05; 
var minThrottleIncrement = 0.02;
// var maxDifferenceBetweenAxes = 0.1;

var motors: {
  1: {name: '1', throttle: setMotorThrottle, armed: false, arm: armMotor, liftoffThrottle: null},
  2: {name: '2', throttle: setMotorThrottle, armed: false, arm: armMotor, liftoffThrottle: null},
  3: {name: '3', throttle: setMotorThrottle, armed: false, arm: armMotor, liftoffThrottle: null},
  4: {name: '4', throttle: setMotorThrottle, armed: false, arm: armMotor, liftoffThrottle: null}
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
  }
};
motors[1].oppositeMotor = motors[3];
motors[2].oppositeMotor = motors[4];
motors[3].oppositeMotor = motors[1];
motors[4].oppositeMotor = motors[2];

function arm() {
  var servoNumber = this.number;
  servo.configure(servoNumber, minPWM, maxPWM , function (err) {
    log('    '+servoNumber,'configured.',err?err:'');
    // Set maxPWM
    servo.setDutyCycle(servoNumber, maxPWM, function (err) {
      log('    '+servoNumber,'max PWM set.',err?err:'');
      setTimeout(function(){
        // Set minPWM
        servo.setDutyCycle(servoNumber, minPWM, function (err) {
          log('    '+servoNumber,'min PWM set.',err?err:'');
          setTimeout(function(){ 
            log('    '+servoNumber,'armed.');
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

// e.g. motors[1].setThrottle(.2);
function setThrottle(throttle){
  //TODO 'this' probably not correct.
  servo.move(this.number, throttle, function(err){
    this.currentThrottle = throttle;
    staticLog(motors[1].currentThrottle, motors[2].currentThrottle, motors[3].currentThrottle, motors[4].currentThrottle);
  });
}