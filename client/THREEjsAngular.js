angular.module('THREE', [])
  .factory('threeService', ['$document', '$q', '$rootScope', function($document, $q, $rootScope){
    var d = $q.defer();
    var onScriptLoad = function(){
      $rootScope.$apply(function(){
        d.resolve(window.THREE);
      });
    };

    var scriptTag = $document[0].createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = "./threejs_added.js";
    scriptTag.onreadystatechange = function(){
      if(this.readyState === 'complete'){
        onScriptLoad();
      }
    };
    scriptTag.onload = onScriptLoad;

    $document[0].getElementsByTagName('body')[0]
      .appendChild(scriptTag);    

    return {
      THREE: function(){
        return d.promise;
      }
    }
  }]);

