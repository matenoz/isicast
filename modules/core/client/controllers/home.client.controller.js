'use strict';

angular.module('core').controller('HomeController', ['$scope','Authentication',
  function ($scope,Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });  
    $scope.popoveRegistro = {
      templateUrl: 'modules/core/client/views/registro-template.html'	  
    };
    // Popover orario
    $scope.popover = {
      templateUrl: 'modules/core/client/views/popover-template.html'	  
    };
  }
]);
