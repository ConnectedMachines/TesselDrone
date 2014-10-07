var mainControl = require('./mainControl.js');
var userReady = mainControl.userReady;
var whichAxisToStabilize = require('.stabilize.js').whichAxisToStabilize;

var checkIfReadyToLaunch = function(){
  setImmediate(function(){
    if(userReady){
      setTimeout(function(){
        launch();
      }, 500);
    } else {
      checkIfReadyToLaunch();
    }
  })
};

var launch = function(){
  setImmediate(function(){
    whichAxisToStabilize('x');
  });
  setImmediate(function(){
    whichAxisToStabilize('y');
  });
};

exports.checkIfReadyToLaunch = checkIfReadyToLaunch;
