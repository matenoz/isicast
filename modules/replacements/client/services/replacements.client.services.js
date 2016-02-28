'use strict';

//Replacements service used for communicating with the replacements REST endpoints
angular.module('replacements').factory('Replacements', ['$resource',
  function ($resource) {
    return $resource('api/replacements/:replacementId', {
      replacementId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
