'use strict';

// Setting up route
angular.module('planes').config(['$stateProvider',
  function ($stateProvider) {
    // Planes state routing
    $stateProvider
      .state('planes', {
        abstract: true,
        url: '/planes',
        template: '<ui-view/>'
      })
      .state('planes.list', {
        url: '',
        templateUrl: 'modules/planes/client/views/list-planes.client.view.html'
      })
      .state('planes.create', {
        url: '/create',
        templateUrl: 'modules/planes/client/views/create-plane.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('planes.view', {
        url: '/:planeId',
        templateUrl: 'modules/planes/client/views/view-plane.client.view.html'
      })
      .state('planes.edit', {
        url: '/:planeId/edit',
        templateUrl: 'modules/planes/client/views/edit-plane.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
