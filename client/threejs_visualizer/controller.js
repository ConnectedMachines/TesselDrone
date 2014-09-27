angular.module('MadProps')
  .controller('THREEvisualizerController', ['$scope', function($scope){
    var loop = function recurse(){
      if($scope.threeVisualizerIsLoaded){
        $scope.$emit('threeLoaded');
      }else{
        setTimeout(recurse, 100);
      }
    }
    loop();

    $scope.$on('throttleData', function(){
      var data = arguments[1];
      $scope.engine1.throttle = data.e1*10;
      $scope.engine2.throttle = data.e2*10;
      $scope.engine3.throttle = data.e3*10;
      $scope.engine4.throttle = data.e4*10;
    })
  }]);
