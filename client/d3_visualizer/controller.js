angular.module('MadProps')
  .controller('D3visualizerController', ['$scope', function($scope){
    // loop async until directive has finished executing
    var loop = function recurse(){
      if($scope.d3VisualizerIsLoaded){
        $scope.$emit('d3Loaded');
      }else{
        setTimeout(recurse, 100);
      }
    }
    loop();

    $scope.$on('throttleData', function(){
      var data = arguments[1];
      console.log(data)
      setEngine1(data.motor1);
      setEngine2(data.motor2);
      setEngine3(data.motor3);
      setEngine4(data.motor4);
    })

    var setEngine1 = function(data){
      if(data > 0.6){
        $scope.renderEngine1('#707070', true);// red
      }else if(data > 0.5){
        $scope.renderEngine1('#FF6600', true);// orange
      }else if(data > 0.4){
        $scope.renderEngine1('#EDED00', true);// yellow
      }else if(data > 0){
        $scope.renderEngine1('#008a2e', true);// green
      }else{
        $scope.renderEngine1('#707070', false);// grey (off)
      }
    }

    var setEngine2 = function(data){
      if(data > 0.6){
        $scope.renderEngine2('#707070', true);// red
      }else if(data > 0.5){
        $scope.renderEngine2('#FF6600', true);// orange
      }else if(data > 0.4){
        $scope.renderEngine2('#EDED00', true);// yellow
      }else if(data > 0){
        $scope.renderEngine2('#008a2e', true);// green
      }else{
        $scope.renderEngine2('#707070', false);// grey (off)
      }
    }

    var setEngine3 = function(data){
      if(data > 0.6){
        $scope.renderEngine3('#707070', true);// red
      }else if(data > 0.5){
        $scope.renderEngine3('#FF6600', true);// orange
      }else if(data > 0.4){
        $scope.renderEngine3('#EDED00', true);// yellow
      }else if(data > 0){
        $scope.renderEngine3('#008a2e', true);// green
      }else{
        $scope.renderEngine3('#707070', false);// grey (off)
      }
    }

    var setEngine4 = function(data){
      if(data > 0.6){
        $scope.renderEngine4('#707070', true);// red
      }else if(data > 0.5){
        $scope.renderEngine4('#FF6600', true);// orange
      }else if(data > 0.4){
        $scope.renderEngine4('#EDED00', true);// yellow
      }else if(data > 0){
        $scope.renderEngine4('#008a2e', true);// green
      }else{
        $scope.renderEngine4('#707070', false);// grey (off)
      }
    }
  }]);
