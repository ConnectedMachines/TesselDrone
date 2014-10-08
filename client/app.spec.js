'use strict';

// describe('Client', function(){
//   it('exists', function(){
//     expect(angular.module('MadProps')).toBeDefined();
//   });
  
//   describe('About', function(){
//     it('Route exists', function () {
//       var wasRouteFound = false;
//       var configBlocks = angular.module('MadProps')._configBlocks;
//       configBlocks.forEach(function(configBlock){
//         if(configBlock[2][0].toString().indexOf("url:'/about'") >= 0){
//           wasRouteFound = true;
//         }
//       });
//       expect(wasRouteFound).toBe(true);
//     });
//     xit('Navigating to /about triggers this route.', function(){
//     });
//   });
// });

describe('Client', function() {
  beforeEach(module('MadProps'));

  describe('AppController', function () {
    var controller, scope;
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      controller = $controller('AppController', {
        $scope: scope
      });
    }));
    it('exists', function() {
      expect(controller).toBeDefined();
    });
  });

  describe('cardController', function () {
    var controller, scope;
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      controller = $controller('cardController', {
        $scope: scope
      });
    }));
    it('has settings', function() {
      expect(scope.settings).toBeDefined();
    });
  });

  describe('MasterController', function() {
    beforeEach(module('MadProps'));
    var MasterController, scope, rootScope;
    beforeEach(inject(function($controller, $rootScope) {
      rootScope = $rootScope;
      scope = $rootScope.$new();
      MasterController = $controller('MasterController', {
        $scope: scope
      });
    }));
    it('on d3Loaded, that flag becomes true', function () {
      expect(scope.d3VisualizerLoaded).toBe(false);
      scope.$broadcast('d3Loaded');
      expect(scope.d3VisualizerLoaded).toBe(true);
    });
    it('on threeLoaded, that flag becomes true', function () {
      expect(scope.threeVisualizerLoaded).toBe(false);
      scope.$broadcast('threeLoaded');
      expect(scope.threeVisualizerLoaded).toBe(true);
    });
    it('on socket:droneData, only if both loaded flags are true, then broadcasts.', function () {
      scope.$broadcast('socket:droneData');
      expect(scope.data).not.toBeDefined();
      scope.d3VisualizerLoaded = true;
      scope.threeVisualizerLoaded = true;
      var data = JSON.stringify('{attitude:0, motorThrottle:0}');
      scope.$broadcast('socket:droneData', data);
      expect(scope.data).toBeDefined();
    });

    // it("should broadcast something", function() {
    //   spyOn(scope, '$broadcast');
    //   scope.$broadcast('d3Loaded');
    //   scope.$broadcast('threeLoaded');
    //   scope.$broadcast('socket:droneData');
    //   expect(scope.$broadcast).toHaveBeenCalledWith('attitudeData');
    //   expect(scope.$broadcast).toHaveBeenCalledWith('throttleData');
    // });

    it('has listeners on \'d3Loaded\', \'threeLoaded\', and \'socket:droneData\'', function(){
      expect(scope.$$listeners.d3Loaded).toBeDefined();
      expect(scope.$$listeners.threeLoaded).toBeDefined();
      expect(scope.$$listeners['socket:droneData']).toBeDefined();
    });
  });
    // it('listens for \'d3Loaded\'', function(){
      // $rootScope.$broadcast("d3Loaded");
      // console.log(scope.$on.mostRecentCall.args);      
      // socket.forward('d3Loaded', $scope);
      // console.log(scope.$$listeners.d3Loaded).toBeDefined();
    // });
    // it('on \'d3Loaded\', sets to true', function() {
    //   console.log(scope.$$listeners.contains);
    //   console.log(scope.$on);
    //   // scope.$emit('d3Loaded');
    //   expect(scope.$on).toHaveBeenCalled();
    // });
    // it('initializes loaders to false;', function() {
    //   console.log(this);
    //   expect(d3VisualizerLoaded).toBe(false);
    //   expect(threeVisualizerLoaded).toBe(false);
    // });
    // it('on \'threeLoaded\', sets to true', function() {
    //   scope.$emit('threeLoaded');
    //   expect(threeVisualizerLoaded).toBe(true);
    // });
    // it('on \'socket:droneData\', broadcast drone data', function() {
    //   d3VisualizerLoaded = true;
    //   threeVisualizerLoaded = true;
    //   scope.$emit('socket:droneData', 'alice', {attitude:'bob', motorThrottles:'carl'});

    //   expect(data.attitude).toBeDefined();
    //   expect(data.attitude).toBe('bob');
    //   expect(data.motorThrottles).toBeDefined();
    //   expect(data.motorThrottles).toBe('carl');
    //   // expect broadcast 'attitudeData' to contain data.attitude.
    //   // expect broadcast 'throttleData' to contain data.motorThrottles.
    //   });
    // });

});