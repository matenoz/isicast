'use strict';

//Adoptions service used for communicating with the adoptions REST endpoints
angular.module('adoptions').factory('Adoptions', ['$resource',
  function ($resource) {
    return $resource('api/adoptions/:adoptionId', {
      adoptionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
