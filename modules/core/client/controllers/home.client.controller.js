'use strict';

angular.module('core').controller('HomeController', ['$scope','$http','Authentication',
  function ($scope,$http,Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    // search controller
    $scope.callRestService= function() {
      $http({ method: 'GET', url: '/' })
        .success(function(data, status, headers, config) {
          $scope.results.push(data);
        });
    };
     
    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });  
  }
]);
