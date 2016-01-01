'use strict';

angular.module('docs').directive('homeDocs', [
	function() {
		return {
			templateUrl: 'modules/docs/client/views/list-docs-template.html',
			restrict: 'E',
			transclude:true,
			link: function postLink(scope, element, attrs) {
			}
		};
	}
]);
