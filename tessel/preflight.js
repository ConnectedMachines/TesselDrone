var mainControl = require('./mainControl.js');
var checkIfReadyToLaunch = require('./launch.js').checkIfReadyToLaunch;
var accel = mainControl.accel;
var servo = mainControl.servo;
var accelReadsPerSecond = mainControl.accelReadsPerSecond;
var accelMaxGs = mainControl.accelMaxGs;

var startPreflight = function(){
  console.log('Pre-flight checklist:')
  console.log(' 1.Calibrating modules:')
  servo.on('ready', function(){
    console.log('    Servo module ready.')
    mainControl.isServoModuleReady = true;
  });

  accel.on('ready', function () {
    console.log('    Accel module ready');
    accel.setOutputRate( accelReadsPerSecond, function(err){
      accel.setScaleRange( accelMaxGs, function(err){
        mainControl.isAccelModuleReady = true;
      });
    });
  });

  var checkModules = function(){
    setImmediate(function(){
      if(mainControl.isAccelModuleReady && mainControl.isServoModuleReady){ 
        process.stdin.resume();
        servo.configure(1, 0, 1, function(){
          process.stdin.on('data', function (duty) {
            duty = parseFloat(duty);
            if(duty >= 0){
              servo.move(1, duty);
              mainControl.motors[1].currentThrottle = duty;
              servo.configure(2, 0, 1, function(){
                servo.move(2, duty);
                mainControl.motors[2].currentThrottle = duty;
              });
              servo.configure(3, 0, 1, function(){
                servo.move(3, duty);
                mainControl.motors[3].currentThrottle = duty;
              });
              servo.configure(4, 0, 1, function(){
                servo.move(4, duty);
                mainControl.motors[4].currentThrottle = duty;
              });
            } else {
              mainControl.userReady = true;
            }
          });
        });   
      } else {
        checkModules();
      }
    })
  };
  checkIfReadyToLaunch();
  checkModules();
};

exports.startPreflight = startPreflight;
