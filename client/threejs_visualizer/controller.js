var attitude = {
  pitch: 0,
  yaw: 0,
  roll: 0
};
var engines = {};
angular.module('MadProps')
  .controller('THREEvisualizerController', ['$scope', function($scope){
    setTimeout(function(){
      engines[1] = $scope.engine1;
      engines[2] = $scope.engine2;
      engines[3] = $scope.engine3;
      engines[4] = $scope.engine4;
      $scope.attitude = attitude;
      console.log(engines);
    },750);
  }]);