var mainControl = require('./mainControl.js');
var whichAxisToStabilize = require('./stabilize.js').whichAxisToStabilize;

var launch = function(){
  console.log('launch')
  setImmediate(function(){
    whichAxisToStabilize('x');
  });
  setImmediate(function(){
    whichAxisToStabilize('y');
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


exports.checkIfReadyToLaunch = checkIfReadyToLaunch;
exports.readyToLaunch = readyToLaunch;
