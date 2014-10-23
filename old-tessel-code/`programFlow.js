// Program flow:

var drone = {
  motors: {
    1: {name: '1', throttle: setMotorThrottle, armed: false, arm: armMotor, liftoffThrottle: null},
    2: {name: '2', throttle: setMotorThrottle, armed: false, arm: armMotor, liftoffThrottle: null},
    3: {name: '3', throttle: setMotorThrottle, armed: false, arm: armMotor, liftoffThrottle: null},
    4: {name: '4', throttle: setMotorThrottle, armed: false, arm: armMotor, liftoffThrottle: null}
  },
  accel: {calibrate: function(){}},
  gyro: {calibrate: function(){}},
  magnetometer: {calibrate: function(){}},
  downSonar: {calibrate: function(){}},
  turretSonar: {calibrate: function(){}},
  takeoff: function(){},
  hover: function(altitude){altitude = altitude || 1; /* in meters */ },
  land: function(){}
};

// PRE-FLIGHT
// Immediately shut off each motor in case it has residual throttle.
console.log('Zero out motors');
for(motor in drone.motors){
  var motor = drone.motors[motor];
  motor.throttle(0); // (If motors aren't armed, this should have no effect.)
}

// Check and calibrate available sensors.
console.log('Calibrate sensors.');
drone.accel.calibrate();
drone.gyro.calibrate();
drone.magnetometer.calibrate();
drone.downSonar.calibrate();
drone.turretSonar.calibrate();

// Arm each motor.
for(motor in drone.motors){
  var motor = drone.motors[motor];
  if( !motor.armed )
    motor.arm();
}

// Calibrate motors
for(motor in drone.motors){
  var motor = drone.motors[motor];
  var increase = 0;
  while(drone.accel.level){
    motor.throttle(increase);
    increase += throttleIncrement;
  }
  motor.liftoffThrottle = increase;
  // Compare that throttle to known liftoff to determine throttle % mapping?
  motor.throttle(0);
}

// Results: sensors and motors calibrated and armed, all throttles at 0. 

// TAKE-OFF
drone.takeoff();
drone.hover();

// motor methods
function setMotorThrottle(throttle){
  console.log(' ',this.name,'throttle set to',throttle+'.');
}

function armMotor(){
  console.log(' ',this.name,'armed.');
  this.armed = true;
}; 
