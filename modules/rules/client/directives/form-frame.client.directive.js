'use strict';

angular.module('rules').directive('ngFrame',[
  function() {
    return{
      restrict: 'E',
      transclude: true,
      replace:true,
      compile: function compile(tElement, tAttrs, transclude) {
        return {
	  pre: function(scope) {
	    transclude(scope, function(clone) {
	      scope.transcluded_content = clone;
	    });
	  },
	  post: function(scope, element, attrs){
            element.contents().find('body').html(scope.transcluded_content);
	  }
	};
      },
      template: '<iframe></iframe>'
    };
  }
]);
