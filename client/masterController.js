angular.module('MadProps')
  .controller('MasterController', ['$scope', '$http', 'socket', function($scope, $http, socket){
    var d3VisualizerLoaded = false;
    var threeVisualizerLoaded = false;

    $scope.$on('d3Loaded', function(){
      d3VisualizerLoaded = true;
    });
    $scope.$on('threeLoaded', function(){
      threeVisualizerLoaded = true;
    });
    $scope.$on('socket:droneData', function (ev, data) {
      if(d3VisualizerLoaded && threeVisualizerLoaded){
        data = JSON.parse(data);
        $scope.$broadcast('attitudeData', data.attitude);
        $scope.$broadcast('throttleData', data.motorThrottles);
      }
    });
  }]);
