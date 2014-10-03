var testFoo;
angular.module('MadProps')
  .controller('MasterController', ['$scope', '$http', function($scope, $http){
    var d3VisualizerLoaded = false;
    var threeVisualizerLoaded = false;

    $scope.$on('d3Loaded', function(){
      d3VisualizerLoaded = true;
      onVisualizersLoaded();
    });
    $scope.$on('threeLoaded', function(){
      threeVisualizerLoaded = true;
      onVisualizersLoaded();
    });

    var onVisualizersLoaded = function(){
      if(d3VisualizerLoaded && threeVisualizerLoaded){
        setInterval(function(){
          $http({method: 'GET', url: '/data'})
            .success(function(data, status, headers, config){
              // console.log('onVis:',data);
              $scope.$broadcast('attitudeData', data.attitude);
              $scope.$broadcast('throttleData', data.motorThrottles);
            })
            .error(function(data, status, headers, config){
              console.log('GET VISUALIZER DATA ERROR:', data);
            });
        },100);
      }
    }
  }]);
