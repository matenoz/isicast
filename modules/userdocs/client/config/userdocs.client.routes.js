'use strict';

// Setting up route
angular.module('userdocs').config(['$stateProvider',
  function ($stateProvider) {
    // Userdocs state routing
    $stateProvider
      .state('userdocs', {
        abstract: true,
        url: '/userdocs',
        template: '<ui-view/>'
      })
      .state('userdocs.list', {
        url: '',
        templateUrl: 'modules/userdocs/client/views/list-userdocs.client.view.html',
        data: {
          roles: ['org', 'doc']
        }
      })
      .state('userdocs.create', {
        url: '/create',
        templateUrl: 'modules/userdocs/client/views/create-userdoc.client.view.html',
        data: {
          roles: ['org', 'admin']
        }
      })
      .state('userdocs.view', {
        url: '/:userdocId',
        templateUrl: 'modules/userdocs/client/views/view-userdoc.client.view.html',
        data: {
          roles: ['org', 'doc']
        }
      })
      .state('userdocs.edit', {
        url: '/:userdocId/edit',
        templateUrl: 'modules/userdocs/client/views/edit-userdoc.client.view.html',
        data: {
          roles: ['org', 'admin']
        }
      });
  }
]);
