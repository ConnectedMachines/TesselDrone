var tessel = require('tessel');
var servolib = require('servo-pca9685'); // Or 'servo-pca9685' in your own code
var servo = servolib.use(tessel.port['B']);

var startupTime = 700; // 500 < minStartupTime? < 1000 in ms
var maxPWM = 0.125; // 
var minPWM = 0.002; // Exhaustively tested. 

// return 0.01, 0.00023402934223
var servoNumber = 1;
var startThrottle = 0;
var throttleIncrement = 0.001;
var maxThrottle = 0.5;

var readAndThrottleUp = function(throttle){
  servo.move(servoNumber, throttle, function(err){
    servo.read(servoNumber, function(err, reading){
      console.log(throttle+', '+reading);
      if(throttle < maxThrottle){
        readAndThrottleUp(throttle+throttleIncrement);
      }
    });
  });
};

var configureMotor = function (servoNumber, callback) {
  servo.read(servoNumber, function (err, reading) {
    console.log('ready reading:', reading);
    servo.configure(servoNumber, minPWM, maxPWM , function () {
      servo.read(servoNumber, function (err, reading) {
        console.log('configure reading:', reading);
        servo.setDutyCycle(servoNumber, maxPWM, function (err) {
          servo.read(servoNumber, function (err, reading) {
            console.log('setDutyCycle max reading:', reading)
            setTimeout(function(){
              servo.setDutyCycle(servoNumber, minPWM, function (err) {
                servo.read(servoNumber, function (err, reading) {
                  console.log('setDutyCycle min reading:', reading)
                  setTimeout(function(){ 
                    console.log('Armed');
                    callback();
                  }, startupTime);
                });
              });
            }, startupTime);
          });
        });
      });
    });
  });
};

servo.on('ready', function () {
  configureMotor(servoNumber, function(){ readAndThrottleUp(startThrottle); });
  //functionreadAndThrottleUp.bind(null, startThrottle)
});
