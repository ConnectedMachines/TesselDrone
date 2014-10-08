angular.module('MadProps')
  .controller('MasterController', ['$scope', '$http', 'socket', function($scope, $http, socket){
    $scope.d3VisualizerLoaded = false;
    $scope.threeVisualizerLoaded = false;

    $scope.$on('d3Loaded', function(){
      $scope.d3VisualizerLoaded = true;
    });
    $scope.$on('threeLoaded', function(){
      $scope.threeVisualizerLoaded = true;
    });
    $scope.$on('socket:droneData', function (ev, data) {
      if($scope.d3VisualizerLoaded && $scope.threeVisualizerLoaded){
        $scope.data = JSON.parse(data);
        $scope.$broadcast('attitudeData', $scope.data.attitude);
        $scope.$broadcast('throttleData', $scope.data.motorThrottles);
      }
    });
  }]);
