describe('Directive: dronestatus', function(){
  var element, scope;
  beforeEach(module('app'));
  beforeEach(inject(function($rootScope, $compile){
    scope = $rootScope.$new();
    element = '<div dronestatus></div>';
    element = $compile(element)(scope);
    scope.$digest();
  }));

  describe('SVG element creation', function(){

  });
});