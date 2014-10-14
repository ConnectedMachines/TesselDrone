angular.module('MadProps')
  .controller('MasterController', ['$scope', '$http', 'socket', function($scope, $http, socket){
    var d3VisualizerLoaded = false;
    var threeVisualizerLoaded = false;

    _override = {};
    Object.defineProperty(_override, 'attitude', {
      set: function(arr){   // Math.round(arr[0]*(Math.PI/180))
        $scope.$broadcast('attitudeData', {pitch: arr[0]*(Math.PI/180), yaw: arr[1]*(Math.PI/180), roll: arr[2]*(Math.PI/180)});
      }
    });
    Object.defineProperty(_override, 'throttle', {
      set: function(arr){
        $scope.$broadcast('throttleData', {motor1: arr[0], motor2: arr[1], motor3: arr[2], motor4: arr[3]});
      }
    });
    Object.defineProperty(_override, 'tumble', {
      set: function(bool){
        $scope._tumble = bool;
      }
    });
    Object.defineProperty(_override, 'present', {
      set: function(bool){
        if(bool){
          this.tumble = true;
          this.throttle = [0.8, 0.8, 0.8, 0.8];
        }else{
          this.tumble = false;
          this.throttle = [0,0,0,0];
          this.attitude = [0,0,0];
        }
      }
    });

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
