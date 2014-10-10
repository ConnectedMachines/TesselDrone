var mainControl = require('./mainControl.js');
var proportionConstant = mainControl.proportionConstant;
var integrationConstant = mainControl.integrationConstant;
var derivationConstant = mainControl.derivationConstant;

var PIDoutput = function(axis, currentError){
  var deltaError = currentError - mainControl.previousError[axis];
  var time = Date.now();
  var deltaTime = (time - mainControl.previousTime[axis])/1000; //TODO: add /1000 into constant

  mainControl.lobot[axis].error = currentError;
  mainControl.lobot[axis].dError = deltaError;
  mainControl.lobot[axis].dTime = deltaTime;

  if(Math.abs(deltaTime) < 10000000){ //fix this - reason for this current condition is time will evaluate high the first call through
    mainControl.sumError[axis] += currentError * deltaTime;
  }

  mainControl.previousTime[axis] = time; //setting historical time marker for next time function is called;
  
  var P = proportionConstant * currentError;
  var I = integrationConstant * mainControl.sumError[axis];
  var D = derivationConstant * deltaError / deltaTime;

  mainControl.lobot[axis].P = P;
  mainControl.lobot[axis].I = I;
  mainControl.lobot[axis].D = D;

  if((P > 0 && P + I + D < 0) || (P < 0 && P + I + D > 0)){ // to filter the offchance that the correction needed to be positive but the I and D turn it negative
    mainControl.lobot[axis].correction = null;
    return 0;
  } else {
    mainControl.lobot[axis].correction = P + I + D;
    return P + I + D; 
  }
};

exports.PIDoutput = PIDoutput;
