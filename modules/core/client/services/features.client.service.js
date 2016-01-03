'use strict';

angular.module('core').factory('Features', ['$resource',function($resource) {
  return $resource('/features');
}
]);
