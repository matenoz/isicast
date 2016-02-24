'use strict';

//Classes service used for communicating with the classes REST endpoints
angular.module('classes').factory('Ctimetables', ['$resource',
  function ($resource) {
    return $resource('api/ctimetables/:classeId', {
      classeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
