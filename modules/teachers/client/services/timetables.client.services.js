'use strict';

//Teachers service used for communicating with the teachers REST endpoints
angular.module('teachers').factory('Timetables', ['$resource',
  function ($resource) {
    return $resource('api/timetables/:teacherId', {
      teacherId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
