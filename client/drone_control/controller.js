angular.module('MadProps')
  .controller('DroneCommandController', function ($scope, Requests, socket) {
    $scope.drone = {};
    $scope.drone.status = "idle";
    //Possible Socket.io
    //Angular socket io


    $scope.preflight = function () {
      $scope.drone.status = "Checking motors";
      Requests.emitCondition('preflight');
    };

    $scope.takeOff = function () {
      $scope.drone.status = "Taking Off";
      Requests.emitCondition('takeoff');
    };
    $scope.land = function () {
      $scope.drone.status = "Landing";
      Requests.emitCondition('land');
    };
  })

  .factory('Requests', function (socket) {
    var emitCondition = function (signalToEmit) {
      socket.emit(signalToEmit, signalToEmit, function (data) {
        return data;
      });
    };
    return {
      emitCondition: emitCondition
    };
  });
