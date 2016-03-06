'use strict';

angular.module('teachers').directive('absenceList', [function() {
  return {
    templateUrl: 'modules/teachers/client/views/absence-list-template.html',
    restrict: 'E',  
    transclude:true,
    scope:{
      teacher:'='
    },  
    link: function postLink(scope, element, attrs) {
    }
  };
}
]);
