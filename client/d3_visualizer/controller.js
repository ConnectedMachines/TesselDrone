var propellers;
var grey = '#707070';
var green = '#008a2e';
var yellow = '#EDED00';
var orange = '#FF6600';
var red = '#FF0000';

angular.module('MadProps')
  .controller('D3visualizerController', ['$scope', '$window', function($scope, $window){
    var loop = function(){
      if(!$scope.visualizationIsLoaded){
        setTimeout(loop,100);
      }else{
        propellers = {
          1: $scope.renderEngine1,
          2: $scope.renderEngine2,
          3: $scope.renderEngine3,
          4: $scope.renderEngine4
        };
      }
    }
    loop();
  }]);
