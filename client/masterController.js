angular.module('MadProps')
  .controller('MasterController', ['$scope', function($scope){
    var d3VisualizerLoaded = false;
    var threeVisualizerLoaded = false;

    $scope.$on('d3Loaded', function(){
      d3VisualizerLoaded = true;
    });
    $scope.$on('threeLoaded', function(){
      threeVisualizerLoaded = true;
    });

    // loops async until both d3 vis and THREEjs vis is loaded
    var loop = function recurse(){
      if(d3VisualizerLoaded && threeVisualizerLoaded){
        var throttleData = new LinkedList();
        throttleData.addToTail({e1: 0, e2: 0, e3: 0, e4: 0});
        throttleData.addToTail({e1: 0.1, e2: 0.1, e3: 0.1, e4: 0.1});
        throttleData.addToTail({e1: 0.2, e2: 0.2, e3: 0.2, e4: 0.2});
        throttleData.addToTail({e1: 0.3, e2: 0.3, e3: 0.3, e4: 0.3});
        throttleData.addToTail({e1: 0.3, e2: 0.3, e3: 0.3, e4: 0.3});
        throttleData.addToTail({e1: 0.3, e2: 0.3, e3: 0.3, e4: 0.3});
        throttleData.addToTail({e1: 0.3, e2: 0.3, e3: 0.3, e4: 0.3});
        throttleData.addToTail({e1: 0.4, e2: 0.4, e3: 0.4, e4: 0.4});
        throttleData.addToTail({e1: 0.4, e2: 0.4, e3: 0.4, e4: 0.4});
        throttleData.addToTail({e1: 0.4, e2: 0.4, e3: 0.4, e4: 0.4});
        throttleData.addToTail({e1: 0.4, e2: 0.4, e3: 0.4, e4: 0.4});
        throttleData.addToTail({e1: 0.5, e2: 0.5, e3: 0.5, e4: 0.5});
        throttleData.addToTail({e1: 0.5, e2: 0.5, e3: 0.5, e4: 0.5});
        throttleData.addToTail({e1: 0.5, e2: 0.5, e3: 0.5, e4: 0.5});
        throttleData.addToTail({e1: 0.5, e2: 0.5, e3: 0.5, e4: 0.5});
        throttleData.addToTail({e1: 0.6, e2: 0.6, e3: 0.6, e4: 0.6});
        throttleData.addToTail({e1: 0.6, e2: 0.6, e3: 0.6, e4: 0.6});
        throttleData.addToTail({e1: 0.6, e2: 0.6, e3: 0.6, e4: 0.6});
        throttleData.addToTail({e1: 0.6, e2: 0.6, e3: 0.6, e4: 0.6});
        throttleData.addToTail({e1: 0.7, e2: 0.7, e3: 0.7, e4: 0.7});
        throttleData.addToTail({e1: 0.7, e2: 0.7, e3: 0.7, e4: 0.7});
        throttleData.addToTail({e1: 0.7, e2: 0.7, e3: 0.7, e4: 0.7});
        throttleData.addToTail({e1: 0.7, e2: 0.7, e3: 0.7, e4: 0.7});
        throttleData.addToTail({e1: 0.6, e2: 0.6, e3: 0.6, e4: 0.6});
        throttleData.addToTail({e1: 0.6, e2: 0.6, e3: 0.6, e4: 0.6});
        throttleData.addToTail({e1: 0.6, e2: 0.6, e3: 0.6, e4: 0.6});
        throttleData.addToTail({e1: 0.6, e2: 0.6, e3: 0.6, e4: 0.6});
        throttleData.addToTail({e1: 0.5, e2: 0.5, e3: 0.5, e4: 0.5});
        throttleData.addToTail({e1: 0.5, e2: 0.5, e3: 0.5, e4: 0.5});
        throttleData.addToTail({e1: 0.5, e2: 0.5, e3: 0.5, e4: 0.5});
        throttleData.addToTail({e1: 0.5, e2: 0.5, e3: 0.5, e4: 0.5});
        throttleData.addToTail({e1: 0.4, e2: 0.4, e3: 0.4, e4: 0.4});
        throttleData.addToTail({e1: 0.4, e2: 0.4, e3: 0.4, e4: 0.4});
        throttleData.addToTail({e1: 0.4, e2: 0.4, e3: 0.4, e4: 0.4});
        throttleData.addToTail({e1: 0.4, e2: 0.4, e3: 0.4, e4: 0.4});
        throttleData.tail.next = throttleData.head.next.next.next;

        var curr = throttleData.head;
        var flag = true;
        var loop = makeAsyncWhile(function(){return flag});
        loop.push(function(){
          $scope.$broadcast('throttleData', curr.value, 'test');
          curr = curr.next;
        });
      }else{
        setTimeout(recurse, 100);
      }
    }
    loop();

  }]);

  var LinkedList = function(){
    this.head = null;
    this.tail = null;
  };

  LinkedList.prototype.newNode = function(value){
    return {
      value: value,
      next: null
    }
  };

  LinkedList.prototype.addToTail = function(value){
    var node = this.newNode(value);
    if(this.head === null){
      this.head = this.tail = node;
    }else{
      this.tail.next = node;
      this.tail = node;
    }
  };

  var makeAsyncWhile = function(condition){
    var functionList = [];
    var loop = function(){
      if(condition()){
        setTimeout(loop, 200);
        functionList.forEach(function(func){
          func();
        });
      }
    }
    loop();
    return functionList;
  }
