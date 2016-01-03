'use strict';

//Deadlines service used for communicating with the deadlines REST endpoints
angular.module('deadlines').factory('Deadlines', ['$resource',function ($resource) {
  return $resource('api/deadlines/:deadlineId', {
    deadlineId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
}
]);
