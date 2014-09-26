var attitude = {
  pitch: 45,
  yaw: 0,
  roll: 0
};
var engines = {};
angular.module('MadProps')
  .controller('THREEvisualizerController', ['$scope', function($scope){
    setTimeout(function(){
      engines[1] = $scope.engine1;
      engines[2] = $scope.engine2;
      engines[3] = $scope.engine3;
      engines[4] = $scope.engine4;
      $scope.attitude = attitude;

      // preflight test of all engines
      var flag = true;
      var loop = makeAsyncWhile(function(){
        return flag;
      }, 100);
      console.log('start preflight test!')
      loop.push(function(){
        console.log('throttling up!');
        throttleUp(engines[1], function(){
          loop.pop();
          loop.push(function(){
            console.log('throttling down!');
            throttleDown(engines[1], function(){
              console.log('engine 1 finished');
              loop.pop();
              loop.push(function(){
                console.log('throttling up!');
                throttleUp(engines[2], function(){
                  loop.pop();
                  loop.push(function(){
                    console.log('throttling down!');
                    throttleDown(engines[2], function(){
                      console.log('engine 2 finished');
                      loop.pop();
                      loop.push(function(){
                        console.log('throttling up!');
                        throttleUp(engines[3], function(){
                          loop.pop();
                          loop.push(function(){
                            console.log('throttling down!');
                            throttleDown(engines[3], function(){
                              console.log('engine 3 finished');
                              loop.pop();
                              loop.push(function(){
                                console.log('throttling up!');
                                throttleUp(engines[4], function(){
                                  loop.pop();
                                  loop.push(function(){
                                    console.log('throttling down!');
                                    throttleDown(engines[4], function(){
                                      loop.pop();
                                      flag = false;
                                      console.log('preflight complete!');
                                      setTimeout(simulateTakeOff, 1000);
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });


    },750);
  }]);

var makeAsyncWhile = function(condition, interval){
  var functionList = [];
  var loop = function(){
    if(condition()){
      setTimeout(loop, interval);
      functionList.forEach(function(func){
        func();
      });
    }
  }
  loop();
  return functionList;
};

var throttleUp = function(engine, callback){
  if(engine.throttle < 7){
    engine.throttle += 0.25;
  }else{
    engine.throttle = 7;
    callback();
  }
};

var throttleDown = function(engine, callback){
  if(engine.throttle > 0){
    engine.throttle -= 0.5;
  }else{
    engine.throttle = 0;
    callback();
  }
};

var simulateTakeOff = function(){
  var flag = true;
  var test = makeAsyncWhile(function(){return flag}, 100);
  test.push(function(){
    throttleUp(engines[1],function(){});
  });
  test.push(function(){
    throttleUp(engines[2],function(){});
  });
  test.push(function(){
    throttleUp(engines[3],function(){});
  });
  test.push(function(){
    throttleUp(engines[4],function(){flag = false});
  });
};




