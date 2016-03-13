'use strict';

// Setting up route
angular.module('features').config(['$stateProvider',
  function ($stateProvider) {
    // Features state routing
    $stateProvider
      .state('features', {
        abstract: true,
        url: '/features',
        template: '<ui-view/>'
      })
      .state('features.list', {
        url: '',
        templateUrl: 'modules/features/client/views/list-features.client.view.html'
      })
      .state('features.create', {
        url: '/create',
        templateUrl: 'modules/features/client/views/create-feature.client.view.html',
        data: {
          roles: ['public', 'admin']
        }
      })
      .state('features.view', {
        url: '/:featureId',
        templateUrl: 'modules/features/client/views/view-feature.client.view.html'
      })
      .state('features.edit', {
        url: '/:featureId/edit',
        templateUrl: 'modules/features/client/views/edit-feature.client.view.html',
        data: {
          roles: ['public', 'admin']
        }
      });
  }
]);
