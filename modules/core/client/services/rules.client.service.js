'use strict';

angular.module('core').factory('Rules', ['$resource',function($resource) {
  return $resource('/rules');
}
]);
