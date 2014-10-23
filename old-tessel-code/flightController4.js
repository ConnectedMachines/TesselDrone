/* ### NOTES ############

  Human reaction time is between 100ms and 400ms, so flips happen faster than that.

  We need to know
  - how quickly the gyro returns data
  - how quickly the motors respond to commands
  - how quickly the control loop executes
  - if ∂Orientation/cycle is increasing or decreasing (ie flipping faster or arresting a flip)

  We shouldn't care about
  - motors' relative throttles, because balance code should control them such that drone remains balanced

  - Command loop should calculate appropriate throttle settings till next command loop.
  - so don't set motor throttles more than once a command loop 

  - 1° diff === 0.0013667 throttle change?


*///#####################

// var tessel = require('tessel') || {port:{'C':{on:function(){}, configure:function(){}, setDutyCycle:function(){}, move:function(){}}}};
// var servo = require('servo-pca9685').use(tessel.port['C']);

var currentAltitude; //TODO
var altitudeThrottleChange; //TODO
var motors = {
  1: {throttle:0}, 
  2: {throttle:0},
  3: {throttle:0},
  4: {throttle:0}
};  
function checkBalance(){}; //TODO Jake/Geoffrey

// servo.on('ready', onServoModuleReady);
// var accel; // TODO
// var gyro = { // TODO
//   data: { x:0, y:0, z:0 },
//   calibrate: function(){ console.log('sets offsets to zero out gyro ωXYZ data while at rest'); }; // TODO
//   getData: function(){ return {x:ωX, y:ωy, z:ωz}; } // TODO
//   scratch: function(){
//     // Poll IMU for gyro data.
//     gyro.data = gyro.getData();
//     // Determine if drone is unbalanced.
//     // NO! gyro.unbalanced = Math.abs(gyro.data.x) > 0 && Math.abs(gyro.data.y) === 0 ? true : false;
//   }
// };

// Configure things like motors, sensors, server connection prior to flight.
function configure(){
  // Wait for Tessel servo module to be ready. 
  servo.on('ready', function(){
    // Configure servo module upper and lower values.
    servo.configure(motorNumber, 0, 1, function(){
      // Need to set a minimum wait time because callback can occur before hardware is configured.
      // Set motor throttle upper limit (~0.125).
      servo.setDutyCycle(motorNumber, maxPWM, function(){
        // Need to set a minimum wait time because callback can occur before hardware is configured.
        // Set motor throttle lower limit (~0.002).
        servo.setDutyCycle(motorNumber, minPWM, function(){
          // Need to set a minimum wait time because callback can occur before hardware is configured.
          // Need to set a non-zero throttle within 1-2s of arming motors or else they disarm.
          servo.move(motorNumber, minThrottle, function(){
            console.log('finished configuring, arming, and activating motor',motorNumber);
          });
        });
      });
    });
  });

  // When finished configuring, begin control loop.
  controlLoop();
};

function controlLoop(){
  var balanced = checkBalance();
  // If drone is unbalanced, balance it as the first priority.
  if( !balanced ){
    console.log('Unbalanced; balancing...');
    motorCorrections = balance();
    for(var number in motors){
      var motor = motors[number];
      motor.throttle += motorCorrections[number];
    }
  } else {
  // If drone is balanced, second priority is executing user commands 
  // such as ascend (takeoff), hover, and descend (land).
    console.log('Balanced; executing user command'); //TODO
    changeAltitude( hover(1) );
  }

  // Actually issue commands to motors.
  for(var number in motors){
    var motor = motors[number];
    motor.move( motor.throttle );
  }

  // Re-execute control loop (avoiding call stack excesses).
  // setImmediate/nextTick: controlLoop //TODO
}

// Given an x and y orientation, set motors to correct that imbalance.
// Magnitude of correction correlates to magnitiude of orientation.
// x and y angles must be ≥-90° ≤+90°
function balance(xAngleInDegrees, yAngleInDegrees){ 
  // Note, 1 is +x, 2 is +y, 3 is -x, 4 is -y 
  // At 90°, top motor is 0, bottom motor is 2x throttle
  var motorCorrections = { 
    1: -1*xAngleInDegrees*(motors[1].throttle/90),
    2: -1*yAngleInDegrees*(motors[2].throttle/90),
    3: xAngleInDegrees*(motors[3].throttle/90),
    4: yAngleInDegrees*(motors[4].throttle/90)
  };

  return motorCorrections;
};

// Maintain an altitude.
function hover(targetAltitude) { 
  if (currentAltitude < targetAltitude) {
    // console.log('Too low; ascending...');
    return altitudeThrottleChange;
  } else if (currentAltitude > targetAltitude) { 
    // console.log('Too high; descending...');
    return -1*altitudeThrottleChange; 
  } else {
    // console.log('Maintaining target altitude.');
    return 0;
  } 
};

function changeAltitude(throttleChange){
  // increase or decrease all throttles to make drone rise.
  for(var number in motors){
    motor = motors[number];
    motor.throttle += throttleChange;
  }
};

// ### TESTS ######################### 
function testHover(currentAlt, targetAltitude){ 
  var tempCurrentAltitude = currentAltitude; // mock currentAltitude
  currentAltitude = currentAlt;
  var tempAltitudeThrottleChange = altitudeThrottleChange; // mock altitudeThrottleChange
  altitudeThrottleChange = 0.001;
  actualValue = hover(targetAltitude);
  if (currentAlt < targetAltitude){
    expectedValue = altitudeThrottleChange;
  } else if (currentAlt > targetAltitude) {
    expectedValue = -1*altitudeThrottleChange;
  } else { // currentAlt === targetAltitude
    expectedValue = 0;
  }
  currentAltitude = tempCurrentAltitude; // undo mock currentAltitude
  altitudeThrottleChange = tempAltitudeThrottleChange; // undo mock altitudeThrottleChange
  return actualValue === expectedValue;
}
console.log(testHover(0, 1), testHover(2, 1), testHover(3, 3), 'test hover:');

function testChangeAltitude(expectedValue){
  var tempMotors = motors; // mock
  motors = {1: {throttle: 0}};
  changeAltitude(expectedValue);
  actualValue = motors[1].throttle;
  motors = tempMotors; // undo mock
  return actualValue === expectedValue;
}
console.log(testChangeAltitude(0.01), testChangeAltitude(0), testChangeAltitude(-0.01), 'test changeAltitude:');

function testBalance(xAngleInDegrees, yAngleInDegrees, currentThrottle){
  var tempMotors = motors;
  motors = {
    1:{throttle:currentThrottle},
    2:{throttle:currentThrottle},
    3:{throttle:currentThrottle},
    4:{throttle:currentThrottle}
  };
  motorCorrections = balance(xAngleInDegrees, yAngleInDegrees);
  motors = tempMotors; // undo mock motors

  if(xAngleInDegrees > 0){
    if( !(motorCorrections[1] < 0) ){ return false; };
    if( !(motorCorrections[3] > 0) ){ return false; };
  } else if (xAngleInDegrees < 0){
    if( !(motorCorrections[1] > 0) ){ return false; };
    if( !(motorCorrections[3] < 0) ){ return false; };
  } else {
    if( !(motorCorrections[1] === 0) ){ return false; };
    if( !(motorCorrections[3] === 0) ){ return false; };
  }

  if(yAngleInDegrees > 0){
    if( !(motorCorrections[2] < 0) ){ return false; };
    if( !(motorCorrections[4] > 0) ){ return false; };
  } else if (yAngleInDegrees < 0){
    if( !(motorCorrections[2] > 0) ){ return false; };
    if( !(motorCorrections[4] < 0) ){ return false; };
  } else {
    if( !(motorCorrections[2] === 0) ){ return false; };
    if( !(motorCorrections[4] === 0) ){ return false; };
  }

  return true;
};
console.log( testBalance(0,0, .07), 'test balance level');
console.log( testBalance(90,0, .07), 'test balance: when +x too high, +x motor decreases & -x motor increases'); // +x: <0, -x: >0, +y: 0, -y: 0
console.log( testBalance(0,90, .07), 'test balance: when +y too high, +y motor decreases & -y motor increases'); // +x: 0, -x: 0, +y: <0, -y: >0
console.log( testBalance(-90,0, .07), 'test balance: when -x too high, -x motor decreases & +x motor increases'); // +x: >0, -x: <0, +y: 0, -y: 0
console.log( testBalance(0,-90, .07), 'test balance: when -y too high, -y motor decreases & +y motor increases'); // +x: 0, -x: 0, +y: >0, -y: <0
// console.log( testBalance(90,90, .07), '? test balance: when +xy too high, +x, +y motors decrease & -x, -y motors increase'); // +x: <0, -x: >0, +y: <0, -y: >0
// console.log( testBalance(-90,-90, .07), '? test balance: when -xy too high, -x, -y motors decrease & +x, +y motors increase'); // +x: >0, -x: <0, +y: >0, -y: <0











