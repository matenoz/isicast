'use strict';

angular.module('deadlines').directive('homeDeadlines', [
	function() {
		return {
			templateUrl: 'modules/deadlines/client/views/list-deadlines-template.html',
			restrict: 'E',
			transclude:true,
			link: function postLink(scope, element, attrs) {
			}
		};
	}
]);
