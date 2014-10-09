var mainControl = require('./mainControl.js');
var proportionConstant = mainControl.proportionConstant;
var integrationConstant = mainControl.integrationConstant;
var derivationConstant = mainControl.derivationConstant;

var PIDoutput = function(axis, currentError){
  var deltaError = currentError - mainControl.previousError[axis];
  var time = Date.now();
  var deltaTime = (time - mainControl.previousTime[axis])/1000; //TODO: add /1000 into constant

  console.log('∆Time: ' +deltaTime);
  console.log('∆Error: ' +deltaError);

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

  if((P > 0 && P + I + D < 0) || (P < 0 && P + I + D > 0)){ // to filter the offchance that the correction needed to be positive but the I and D turn it negative
    return 0;
  } else {
    return P + I + D; 
  }
};

exports.PIDoutput = PIDoutput;
