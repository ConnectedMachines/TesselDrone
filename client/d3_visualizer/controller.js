angular.module('MadProps')
  .controller('D3VisualizerController', ['$scope', function($scope){
    // detect if visualization is loaded
    var checkVisualizationLoadStatus = function(){
      if($scope.visualizationIsLoaded){
        setTimeout(function(){
          $scope.propellerData.forEach(function(propeller){
            propeller.color = 'yellow';
          });
          $scope.renderPropellers();

          setTimeout(function(){
            $scope.propellerData.forEach(function(propeller){
              propeller.color = 'Orange';
            });
            $scope.renderPropellers();

            setTimeout(function(){
              $scope.propellerData.forEach(function(propeller){
                propeller.color = 'Red';
              });
              $scope.renderPropellers();
            }, 3000);
          }, 3000);
        }, 3000);
      }else{
        // fail case: check again in 10 miliseconds
        setTimeout(function(){
          checkVisualizationLoadStatus();
        },10);
      }
    };
    checkVisualizationLoadStatus();
  }]);
