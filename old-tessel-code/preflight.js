var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['D']);
var servo = require('servo-pca9685').use(tessel.port['C']);
var mainControl = require('./mainControl.js');
var balance = require('./balance.js');
<<<<<<< HEAD
var colorGreen = mainControl.colorGreen;
var checkMark = mainControl.checkMark;
var colorRed =  mainControl.colorRed;
var colorWhite =  mainControl.colorWhite;
=======
var hover = require('balance.js').hover;
var userReady= mainControl.userReady;
>>>>>>> 961be282f7c1b034e27a60b61be85c963af0f553

console.log('Pre-flight checklist:')
console.log(' 1.Calibrating modules:')

servo.on('ready', function(){
  console.log('    Servo module ready.')
<<<<<<< HEAD
  mainControl.isServoModuleReady = true;
  if(mainControl.isAccelModuleReady && mainControl.isServoModuleReady){ 
    onModulesReady();
  }
=======
  isServoModuleReady = true;
>>>>>>> 961be282f7c1b034e27a60b61be85c963af0f553
});

accel.on('ready', function () {
  console.log('    Accel module ready');
  accel.setOutputRate( accelReadsPerSecond, function(err){
    accel.setScaleRange( accelMaxGs, function(err){
<<<<<<< HEAD
      mainControl.isAccelModuleReady = true;
      if(mainControl.isAccelModuleReady && mainControl.isServoModuleReady){ 
        onModulesReady();
      }
=======
      isAccelModuleReady = true;
>>>>>>> 961be282f7c1b034e27a60b61be85c963af0f553
    });
  });
});

// var onModulesReady = function(){
//   console.log(colorGreen+'    '+checkMark,'All Tessel modules ready.',colorWhite);
//   console.log('  2.Arming motors:');
//   mainControl.motors[1].arm();
//   mainControl.motors[4].arm();
//   mainControl.motors[3].arm();
//   mainControl.motors[2].arm();

var checkModules = function(){
  setImmediate(function(){
    if(isAccelModuleReady && isServoModuleReady){ 
      process.stdin.resume();
      servo.configure(1, 0, 1, function(){
        process.stdin.on('data', function (duty) {
          duty = parseFloat(duty);
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
    } else {
      checkModules();
    }
  })
};



checkModules();

<<<<<<< HEAD
// exports.armAndTakeOff = onModulesReady;
// exports.armAndTakeOff = armAndTakeOff;
exports.onMotorsArmed = onMotorsArmed;
exports.preflightComplete = preflightComplete;
exports.onMotorsArmed = onMotorsArmed;
=======

>>>>>>> 961be282f7c1b034e27a60b61be85c963af0f553

