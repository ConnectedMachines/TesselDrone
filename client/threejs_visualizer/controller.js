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
      console.log(data)
      $scope.attitude = data;
    });
    $scope.$on('throttleData', function(){
      var data = arguments[1];
      console.log(data)
      $scope.throttle = data;
    })
  }]);
  