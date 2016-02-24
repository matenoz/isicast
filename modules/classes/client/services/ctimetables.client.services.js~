'use strict';

//Classes service used for communicating with the classes REST endpoints
angular.module('classes').factory('Classes', ['$resource',
  function ($resource) {
    return $resource('api/classes/:classeId', {
      classeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
