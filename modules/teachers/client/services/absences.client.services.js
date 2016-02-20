'use strict';

//Teachers service used for communicating with the teachers REST endpoints
angular.module('teachers').factory('Absences', ['$resource',
  function ($resource) {
    return $resource('api/absences/:teacherId', {
      teacherId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
