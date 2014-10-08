var mainControl = require('./mainControl.js');
var stabilize = require('./stabilize.js');

var launch = function(){
  console.log('launch')
  setImmediate(function(){
    console.log('setImmediate')
    stabilize.whichAxisToStabilize('x');
  });
  setImmediate(function(){
    stabilize.whichAxisToStabilize('y');
  });
};

var readyToLaunch = function(){
  mainControl.userReady = true;
};

var checkIfReadyToLaunch = function(){
  setImmediate(function(){
    if(mainControl.userReady){
      console.log('user ready')
      setTimeout(function(){
        launch();
      }, 500);
    } else {
      checkIfReadyToLaunch();
    }
  })
};


exports.launch = launch;
exports.readyToLaunch = readyToLaunch;
exports.checkIfReadyToLaunch = checkIfReadyToLaunch;
