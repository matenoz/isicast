'use strict';

//Internships service used for communicating with the internships REST endpoints
angular.module('internships').factory('Internships', ['$resource',
  function ($resource) {
    return $resource('api/internships/:internshipId', {
      internshipId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
