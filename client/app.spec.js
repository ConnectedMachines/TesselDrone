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
    it('on socket:droneData, only if both loaded flags are true, then broadcasts.', function () {
      spyOn(scope, '$broadcast');
      var broadcastingScope = scope.$parent;
      broadcastingScope.$broadcast('socket:droneData', data);
      expect(scope.$broadcast).not.toHaveBeenCalledWith('throttleData', undefined);
      expect(scope.$broadcast).not.toHaveBeenCalledWith('attitudeData', undefined);
      broadcastingScope.$broadcast('d3Loaded');
      broadcastingScope.$broadcast('threeLoaded');
      var data = JSON.stringify('{attitude: 0, motorThrottles: 0}');
      broadcastingScope.$broadcast('socket:droneData', data);
      expect(scope.$broadcast).toHaveBeenCalledWith('throttleData', undefined);
      expect(scope.$broadcast).toHaveBeenCalledWith('attitudeData', undefined);
    });

    it('has listeners on \'d3Loaded\', \'threeLoaded\', and \'socket:droneData\'', function(){
      expect(scope.$$listeners.d3Loaded).toBeDefined();
      expect(scope.$$listeners.threeLoaded).toBeDefined();
      expect(scope.$$listeners['socket:droneData']).toBeDefined();
    });
  });
});