'use strict';

describe('DroneCommandController', function() {
  beforeEach(module('MadProps'));
  var DroneCommandController, scope;
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    DroneCommandController = $controller('DroneCommandController', {
      $scope: scope
    });
    spyOn(scope, 'emitCondition');
  }));

  it('drone status should start at idle', function() {
    expect(scope.drone.status).toEqual('Idle');
  });
  
  it('should have a takeoff function', function(){
    expect(scope.takeOff).toBeDefined();
  });
    
  it('should resolve status to taking off', function(){    
    expect(scope.drone.status).toEqual('Idle');
    scope.takeOff();
    expect(scope.drone.status).toEqual('Taking Off');
  });

  it('should emit a take off condition', function(){
    scope.takeOff();
    expect(scope.emitCondition).toHaveBeenCalled();
  });

  it('should have a land function', function(){
    expect(scope.land).toBeDefined();
  });

  it('should resolve status to landing', function(){
    expect(scope.drone.status).toEqual('Idle');
    scope.land();
    expect(scope.drone.status).toEqual('Landing');
  });  

  it('should emit a land condition', function(){
    scope.land();
    expect(scope.emitCondition).toHaveBeenCalled();
  });      

  it('should have a preflight function', function(){
    expect(scope.preflight).toBeDefined();
  });

  it('should resolve status to checking motors', function(){
    expect(scope.drone.status).toEqual('Idle');
    scope.preflight();
    expect(scope.drone.status).toEqual('Checking Motors');
  });  

  it('should emit a preflight condition', function(){
    scope.preflight();
    expect(scope.emitCondition).toHaveBeenCalled();
  });
});
