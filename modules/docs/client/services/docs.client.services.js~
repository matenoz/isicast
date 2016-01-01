'use strict';

//Docs service used for communicating with the docs REST endpoints
angular.module('docs').factory('Docs', ['$resource',
  function ($resource) {
    return $resource('api/docs/:docId', {
      docId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
