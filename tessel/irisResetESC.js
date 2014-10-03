var tessel = require('tessel');
var servolib = require('servo-pca9685'); // Or 'servo-pca9685' in your own code
var servo = servolib.use(tessel.port['B']);

var startupTime = 2000; // 500 < minStartupTime? < 1000 in ms
var maxPWM = 0.125; // 
var minPWM = 0.002; // Exhaustively tested. 

var servoNumber = 1;
process.stdin.resume();

var afterArmed = function(){
  // servo.move(servoNumber, 0.05, function(err){
    servo.read(servoNumber, function(err, reading){
      console.log(reading);
      process.stdin.on('data', function (duty) {
        duty = parseFloat(String(duty));
        console.log('Setting command position:', duty);
        servo.move(servoNumber, duty);
      });
    });
  // });
};

servo.on('ready', function () {
  configureMotor(servoNumber, afterArmed);
});

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

