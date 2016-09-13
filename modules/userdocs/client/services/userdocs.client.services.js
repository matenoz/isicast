'use strict';

//Userdocs service used for communicating with the userdocs REST endpoints
angular.module('userdocs').factory('Userdocs', ['$resource',
  function ($resource) {
    return $resource('api/userdocs/:userdocId', {
      userdocId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
