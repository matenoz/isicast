'use strict';

//Teachers service used for communicating with the teachers REST endpoints
angular.module('teachers').factory('Teachers', ['$resource',
  function ($resource) {
    return {
      t:  $resource('api/teachers/:teacherId', {
        teacherId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      }),
      c:  $resource('api/classes/:classeId', {
        classeId: '@_id',
      })
    };
  }
]);
