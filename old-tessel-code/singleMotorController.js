// with minPWM 0.002, flight at 0.054

var tessel = require('tessel');
var servolib = require('servo-pca9685'); // Or 'servo-pca9685' in your own code

var servo = servolib.use(tessel.port['C']);

var servoNumber = 1; // Plug your servo or motor controller into port 1

// Reenable the console
process.stdin.resume();
console.log('Type in numbers between 0.0 and 1.0 to command the servo.');
console.log('Values between 0.05 and 0.15 are probably safe for most devices,');
console.log('but be careful and work your way out slowly.');
servo.on('ready', function () {
  servo.configure(servoNumber, 0, 1, function(){
    process.stdin.on('data', function (duty) {
      duty = parseFloat(String(duty));
      console.log('Setting command position:', duty);
      servo.move(servoNumber, duty);
    });
  });
});
