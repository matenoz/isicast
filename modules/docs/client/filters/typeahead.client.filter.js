'use strict';

// Docs filter
angular.module('docs').filter('startFrom', function () {
	return function (input, start) {
	    if (input) {
		start = +start;
		return input.slice(start);
	    }
	    return [];
	};
    });
