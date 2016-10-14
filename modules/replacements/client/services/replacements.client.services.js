'use strict';

//Replacements service used for communicating with the replacements REST endpoints
angular.module('replacements').factory('Replacements', ['$resource',
  function ($resource) {
    return {
      r:  $resource('api/replacements/:replacementId', {
        replacementId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      }),
      t:  $resource('api/teachers/:teacherId', {
        teacherId: '@_id',
      })
    };
  }
]);
