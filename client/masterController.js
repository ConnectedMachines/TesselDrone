var testFoo;
angular.module('MadProps',['btford.socket-io'])
  .controller('MasterController', ['$scope', '$http', function($scope, $http, socket){
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
        $scope.$on('socket:droneData', function (ev, data) {
          $scope.$broadcast('attitudeData', data.attitude);
          $scope.$broadcast('throttleData', data.motorThrottles);
        });
      }
    };
  }])
  .factory('socket', function (socketFactory) {
    var mySocket = socketFactory();
      mySocket.forward('droneData');
      return mySocket;
  });
