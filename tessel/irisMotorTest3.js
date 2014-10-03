var tessel = require('tessel');
var servolib = require('servo-pca9685'); // Or 'servo-pca9685' in your own code
var servo = servolib.use(tessel.port['C']);

var timeBetweenMaxAndMinPWM = 800 // 700 < minStartupTime? < 700 in ms
var timeBetweenMinPWMAndArm = 800 // 700 < minStartupTime? < 700 in ms
var maxPWM = 0.125; // 
var minPWM = 0.002; // Exhaustively tested. 
var throttle = 0.005; // Initial throttle setting

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
process.stdin.resume();

var resetESC = function(servoNumber){
  // Automate this.
  console.log(servoNumber+': To reset ESC, unplug the battery.');
}

var testMotor = function(servoNumber){
  servo.configure(servoNumber, minPWM, maxPWM , function () {
    console.log(servoNumber+': Set upper throttle bound to', maxPWM);
    servo.setDutyCycle(servoNumber, maxPWM, function(err){ if(err){console.log('error!',err)};
      console.log(servoNumber+': Delay by',startupTime,'seconds.');
      setTimeout(function(){
        console.log(servoNumber+': Set lower throttle bound to', minPWM);
        servo.move(servoNumber, minPWM, function(err){ if(err){console.log('error!',err)};
          console.log(servoNumber+': Delay by',startupTime,'seconds.');
          setTimeout(function(){ 
            console.log(servoNumber+': Set throttle to', throttle);
            servo.move(servoNumber, throttle, function(err){ if(err){console.log('error!',err)};
              console.log(servoNumber+': Every',1000,'seconds:');
              var lowerThrottleInterval = setInterval(function(){
                if(throttle > 0.002){ 
                  throttle -= 0.0001;
                  console.log(servoNumber+': Change throttle to', throttle);
                  servo.move(servoNumber, throttle, function(err){ if(err){console.log('error!',err)}; }); 
                } else { 
                  clearInterval(lowerThrottleInterval);
                  resetESC(servoNumber); 
                }
              }, 1000);
            });
          }, timeBetweenMinPWMAndArm);
       });
      }, timeBetweenMaxAndMinPWM);
    });
  });
};

servo.on('ready', function () {
  setTimeout(function(){testMotor(1);},2000);
  
  console.log('Test complete; yielding to manual control.');
  process.stdin.on('data', function (duty) {
    duty = parseFloat(String(duty));
    console.log('Setting command position:', duty);
    servo.move(servoNumber, duty);
  });

  // setTimeout(function(){testMotor(2);},4000);
  // setTimeout(function(){testMotor(3);},6000);
  // setTimeout(function(){testMotor(4);},8000);
});
