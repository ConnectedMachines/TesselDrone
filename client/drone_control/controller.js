angular.module('MadProps')
  .controller('DroneCommandController', function($scope, Requests){
    $scope.drone = {};
    $scope.drone.status = "idle";

    $scope.preflight = function(){
      $scope.drone.status = "Checking motors";
      Requests.preflight()
        .then(function(status){
          $scope.drone.status = "Ready to fly";
        })
    }

    $scope.takeOff = function(){
      $scope.drone.status = "Taking Off";
      Requests.takeOff()
        .then(function(){
          $scope.drone.status = "Successful Takeoff";
        });
    };
    
    $scope.land = function(){
      $scope.drone.status = "Landing";
      Requests.land()
        .then(function(){
          $scope.drone.status = "Successfully Landed";
        });
    };
  })

  .factory('Requests', function($http){
    // var api = '10.8.31.216:8000';
    var preflight = function(){
      return $http({
        method: 'GET',
        url: '//10.8.31.216:8000/preflight'
      }).success(function(data){
        return "Ready to fly"
      })
    };
    var takeOff = function(){
      return $http({
        method: 'GET',
        url: '//10.8.31.216:8000/takeOff'
      })
      .success(function(data){
        return "Successful Takeoff";
      });
    };

    var land = function(){
      return $http({
        method: 'GET',
        url: '//10.8.31.216:8000/land'
      }).success(function(){
        return "Successfully Landed";
      });
    };

    return {
      preflight: preflight,
      takeOff: takeOff,
      land: land
    };
  });
