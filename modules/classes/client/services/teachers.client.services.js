'use strict';

//Teachers service used for communicating with the teachers REST endpoints
angular.module('classes').factory('Teachers', ['$resource',
  function ($resource) {
    return $resource('api/teachers/:teacherId', {
      teacherId: '@_id '
    });
  }
]);
