'use strict';

//Docs service used for communicating with the docs REST endpoints
angular.module('docs').factory('Docs2', ['$resource',function ($resource) {
  return $resource('api/docs/:param1/:param2', {
    param1:'',
    param2:''
  }, {
    update: {
      method: 'PUT'
    }
  });
}
]);
