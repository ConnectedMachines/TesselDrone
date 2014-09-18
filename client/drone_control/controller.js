angular.module('MadProps')
  .controller('DroneCommandController', ['$scope', '$window', function($scope, $window){
    var preflightSuccess = false;
    var status = 'idle';
    
    $scope.preflightTest = function(){
      $window.alert('preflight test running...');
      $window.alert('preflight test successful!');
      preflightSuccess = true;
    };

    $scope.takeoff = function(){
      if(preflightSuccess){
        $window.alert('drone takeoff procedure engaged');
        status = 'hovering';
      }else{
        $window.alert('WARNING!!! please run preflight test before attempting to takeoff');
      }
    };

    $scope.land = function(){
      if(status === 'hovering'){
        $window.alert('drone landing procedure engaged');
        status = 'idle';
      }else{
        $window.alert('ERROR! drone is not able to land');
      }
    };
  }]);
