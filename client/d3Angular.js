angular.module('d3', [])
  .factory('d3Service', ['$document', '$q', '$rootScope', function($document, $q, $rootScope){
    var d = $q.defer();
    var onScriptLoad = function(){
      $rootScope.$apply(function(){
        d.resolve(window.d3);
      });
    };

    var scriptTag = $document[0].createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = '../node_modules/d3/d3.min.js';
    scriptTag.onreadystatechange = function(){
      if(this.readyState === 'complete'){
        onScriptLoad();
      }
    };
    scriptTag.onload = onScriptLoad;

    $document[0].getElementsByTagName('body')[0]
      .appendChild(scriptTag);

    return {
      d3: function(){
        return d.promise;
      }
    }
  }]);