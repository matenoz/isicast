'use strict';

angular.module('rules').directive('homeRules', [
  function() {
    return {	  
      templateUrl: 'modules/rules/client/views/list-rules-template.html',
      restrict: 'E',
      transclude:true,
      link: function postLink(scope, element, attrs) {
      }
    };
  }
]);
