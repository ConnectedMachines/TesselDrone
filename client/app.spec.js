'use strict';

describe('Client', function(){
  it('exists', function(){
    expect(angular.module('MadProps')).toBeDefined();
  });
  
  describe('About', function(){
    it('Route exists', function () {
      var wasRouteFound = false;
      var configBlocks = angular.module('MadProps')._configBlocks;
      configBlocks.forEach(function(configBlock){
        if(configBlock[2][0].toString().indexOf("url:'/about'") >= 0){
          wasRouteFound = true;
        }
      });
      expect(wasRouteFound).toBe(true);
    });
    xit('Navigating to /about triggers this route.', function(){
    });
  });
});
