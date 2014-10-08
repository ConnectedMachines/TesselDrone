var mainControl = require('./mainControl.js');
var previousError = mainControl.previousError;
var previousTime = mainControl.previousTime;
var proportionConstant = mainControl.proportionConstant;
var integrationConstant = mainControl.integrationConstant;
var derivationConstant = mainControl.derivationConstant;
var sumError = mainControl.sumError;

var PIDoutput = function(axis, currentError){
  var deltaError = currentError - previousError[axis];
  var time = Date.now();
  var deltaTime = (time - previousTime[axis])/1000;

  console.log('∆Time: ' +deltaTime);
  console.log('∆Error: ' +deltaError);

  if(Math.abs(deltaTime) < 10000000){ //fix this - reason for this current condition is time will evaluate high the first call through
    sumError[axis] += currentError * deltaTime;
    console.log('sumError'+axis+': '+sumError[axis]);
    console.log('integrationCorrection '+axis+': '+(integrationConstant * sumError[axis]));
    console.log('deltaError / deltaTime'+axis+': '+deltaError / deltaTime);
  }
  previousTime[axis] = time; //setting historical time marker for next time function is called;
  
  var P = proportionConstant * currentError;
  var I = integrationConstant * sumError[axis];
  var D = derivationConstant * deltaError / deltaTime;

  if(P > 0 && P + I + D < 0){
    console.log("Houston we have a problem :", P, I, D);
  }
  return P + I + D;
};

exports.PIDoutput = PIDoutput;
