'use strict';

//Features service used for communicating with the features REST endpoints
angular.module('features').factory('Features', ['$resource',function ($resource) {
  return $resource('api/features/:featureId', {
    featureId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
}
]);
