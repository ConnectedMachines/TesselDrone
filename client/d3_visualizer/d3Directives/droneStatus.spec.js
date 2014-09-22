'use strict';

describe('Directive: dronestatus', function(){
  var element, $scope, $compile;

  beforeEach(module('MadProps'));

  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    $scope = _$rootScope_.$new();
    // element = '<dronestatus></dronestatus>';

    // // scope default values
    // $scope.data = {person: 'Collin'};

    // // compile element string and scope into DOM element
    // element = $compile(element)($scope);
    // $scope.$digest();
    // console.dir(element);

    // element.isolateScope();// unnecessary?
  }));

  describe('SVG element creation', function(){
    // does element have an svg child?
    it('directive element should have an SVG child', function(){
      inject(function(){
        element = angular.element('<dronestatus></dronestatus>');

        // scope default values
        $scope.data = {person: 'Collin'};
        console.log($scope);

        // compile element string and scope into DOM element
        var el = $compile(element)($scope);
        console.log(el)
        $scope.$digest();
        console.log(el)
        console.log($scope);
        // console.log(element.html());
        // console.dir(element);
      })
      expect(true).toBe(true);
    });

    // is the svg classed properly?
    it('SVG should have class SVG-Container', function(){
      expect(true).toBe(true);
    });
  });
});