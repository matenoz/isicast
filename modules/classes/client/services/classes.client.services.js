'use strict';

//Classes service used for communicating with the classes REST endpoints
angular.module('classes').factory('Classes', ['$resource',
  function ($resource) {
    return {
      c:  $resource('api/classes/:classeId', {
        classeId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      }),
      t:  $resource('api/teachers/:teacherId', {
        teacherId: '@_id'
      })
    };
  }
]);
