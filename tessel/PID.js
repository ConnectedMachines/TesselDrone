var mainControl = require('./mainControl.js');
var proportionConstant = mainControl.proportionConstant;
var integrationConstant = mainControl.integrationConstant;
var derivationConstant = mainControl.derivationConstant;

var PIDoutput = function(axis, currentError){
  var deltaError = currentError - mainControl.previousError[axis];
  var time = Date.now();
  var deltaTime = (time - mainControl.previousTime[axis])/1000;

  console.log('∆Time: ' +deltaTime);
  console.log('∆Error: ' +deltaError);
  console.log('DERIV', derivationConstant)

  if(Math.abs(deltaTime) < 10000000){ //fix this - reason for this current condition is time will evaluate high the first call through
    mainControl.sumError[axis] += currentError * deltaTime;
    console.log('sumError'+axis+': '+mainControl.sumError[axis]);
    console.log('integrationCorrection '+axis+': '+(integrationConstant * mainControl.sumError[axis]));
    console.log('deltaError / deltaTime'+axis+': '+deltaError / deltaTime);
  }

  mainControl.previousTime[axis] = time; //setting historical time marker for next time function is called;
  
  var P = proportionConstant * currentError;
  var I = integrationConstant * mainControl.sumError[axis];
  var D = derivationConstant * deltaError / deltaTime;

  if(P > 0 && P + I + D < 0){
    console.log("Houston we have a problem :", P, I, D);
  }
  return P + I + D;
};

exports.PIDoutput = PIDoutput;
