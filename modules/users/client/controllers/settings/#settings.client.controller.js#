'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    $scope.user = Authentication.user;
    
    // match roles
    $scope.check = function(value, array) {
      if(array.indexOf(value) > -1){
        return true;
      }
    };  
  }
]);
