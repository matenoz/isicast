'use strict';

angular.module('core').factory('Deadlines', ['$resource',
	function($resource) {
		return $resource('/deadlines');
	}
]);
