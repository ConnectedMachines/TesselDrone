angular.module('MadProps')
  .controller('DroneCommandController', function ($scope, Requests, socket) {
    $scope.drone = {};
    $scope.drone.status = "IDLE";
    $scope.emitCondition = Requests.emitCondition;
    //Possible Socket.io
    //Angular socket io

    $scope.preflight = function () {
      $scope.drone.status = "CHECKING MOTORS";
      $scope.emitCondition('preflight');
    };

    $scope.takeOff = function () {
      $scope.drone.status = "TAKING OFF";
      $scope.emitCondition('takeoff');
    };
    $scope.land = function () {
      $scope.drone.status = "LANDING";
      $scope.emitCondition('land');
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
