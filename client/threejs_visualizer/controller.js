angular.module('MadProps')
  .controller('THREEvisualizerController', ['$scope', function($scope){
    // loop async until directive has finished executing
    var loop = function recurse(){
      if($scope.threeVisualizerIsLoaded){
        $scope.$emit('threeLoaded');
      }else{
        setTimeout(recurse, 100);
      }
    }
    loop();

    // update throttle of engines when new data is available
    $scope.$on('attitudeData', function(){
      var data = arguments[1];
      $scope.attitude = data;
    });
    // $scope.$on('throttleData', function(){
    //   var data = arguments[1];
    //   $scope.engine1.throttle = data.e1*10;
    //   $scope.engine2.throttle = data.e2*10;
    //   $scope.engine3.throttle = data.e3*10;
    //   $scope.engine4.throttle = data.e4*10;
    // })
  }]);
