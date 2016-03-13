'use strict';

//Planes service used for communicating with the planes REST endpoints
angular.module('planes').factory('Planes', ['$resource',
  function ($resource) {
    return $resource('api/planes/:planeId', {
      planeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
