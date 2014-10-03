var tessel = require('tessel');
var servolib = require('servo-pca9685'); // Or 'servo-pca9685' in your own code
var servo = servolib.use(tessel.port['C']);

var startupTime = 700; // 500 < minStartupTime? < 1000 in ms
var maxPWM = 0.125; // 
var minPWM = 0.002; // Exhaustively tested. 
var throttle = 0.015; // Initial throttle setting
var servos = [1, 2, 3, 4];
var standbySpeed = 0.003;
 /* 4in1 ESC understand:
  * - 1st move PWM set is upper throttle bound (one low beep).
  * - 2nd move PWM set is lower throttle bound (two low beeps).
  * - One high long beep means armed.
  * - 3rd move PWM set is a throttle setting, 0 to 1.
  *
  * - throttle liftoff is .34
  * - min throttle is 0.004
  * 
  * We still need to know: 
  * - minimum startupTime between setting minPWM/maxPWM/throttle.
  */

var resetESC = function (servoNumber) {
  // Automate this.
  console.log(servoNumber + ': To reset ESC, unplug the battery.');
};

var eStop = function (err) {
  servo.move(1, 0, function (err) {
    if (err) {
      console.log('Error stopping Motor: 1')
    }
  });
  servo.move(2, 0, function (err) {
    if (err) {
      console.log('Error stopping Motor: 2')
    }
  });
  servo.move(3, 0, function (err) {
    if (err) {
      console.log('Error stopping Motor: 3')
    }
  });
  servo.move(4, 0, function (err) {
    if (err) {
      console.log('Error stopping Motor: 4')
    }
  });
  console.log('Emergency Stop on error: ', err);
};

var servoStepDown = function (servo, speed, targetSpeed) {
  //The speed to which we are changing the servo to
  targetSpeed = targetSpeed || standbySpeed || 0;
  //Speed refers to the increment that the servo will be steped down by
  speed = speed || 0.01;
  //Making sure that the servo given is one of the 4 that we are using
  if (servo === 1 || servo === 2 || servo === 3 || servo === 4) {
    //This logic tells us if we have completed the step down
    if (speed > targetSpeed) {
      servo.read(servo, function (err, reading) {
        if (err) {
          eStop('Error reading speed of servo: ' + servo + ' ' + error );
        }
        var stepSpeed = /*reading+Conversion math HERE*/-speed;
        if (stepSpeed < targetSpeed) {
          stepSpeed = targetSpeed;
        }
        //actualy setting the speed of the servo
        servo.move(servo, stepSpeed, function (err) {
          if (err) {
            eStop('Error setting speed of servo: ' + servo +' ' + err );
          }
          servoStepDown(servo, speed, targetSpeed);
        });
      });
    }
    console.log('Steping Down Motor: ' + servo + ' Complete: OK');
  } else {
    eStop('Invalid Servo given to servoStepDown: ' + servo);
  }
};

var servosToStandby = function () {
  for (var i = 0; i < servos.length; i++) {
    setTimeout(servoStepDown.bind(this, servos[i], 0.001, standbySpeed),(1000*i)+500);
  };
};

var testMotor = function (servoNumber) {
  servo.configure(servoNumber, minPWM, maxPWM , function () {
    console.log(servoNumber+': Set upper throttle bound to', maxPWM);
    servo.setDutyCycle(servoNumber, maxPWM, function (err) {
      if (err) {
        eStop('Error setting duty cycle of servo ' + servoNumber + ' to ' + maxPWM + ' ' + err);
      }
      console.log(servoNumber+': Delay by',startupTime,'seconds.');
      setTimeout(function(){
        console.log(servoNumber+': Set lower throttle bound to', minPWM);
        servo.move(servoNumber, minPWM, function (err) {
          if (err) {
            eStop('Error setting speed of servo ' + servoNumber + ' to ' + minPWM + ' ' + err);
          }
          console.log(servoNumber+': Delay by',startupTime,'seconds.');
          setTimeout(function(){ 
            console.log(servoNumber+': Set throttle to', throttle);
            servo.move(servoNumber, throttle, function (err) {
              if (err) {
                eStop('Error setting speed of servo ' + servoNumber + ' to ' + throttle + ' ' + err);
              }
              if (servoNumber === 4) {
                console.log('Preflight Startup Complete! \nSetting Motors to Standby')
                setTimeout(function(){
                  servosToStandby();
                }, 5000);
              }
            });
          }, startupTime);
       });
      }, startupTime);
    });
  });
};

servo.on('ready', function () {
  for (var i = 0; i < servos.length; i++) {
    setTimeout(testMotor.bind(this, servos[i]),(1000*i)+1000);
  };
});