'use strict';
// Setting up route
angular.module('deadlines').config(['$stateProvider',
  function ($stateProvider) {
    // Deadlines state routing
    $stateProvider
      .state('deadlines', {
        abstract: true,
        url: '/deadlines',
        template: '<ui-view/>'
      })
      .state('deadlines.list', {
        url: '',
        templateUrl: 'modules/deadlines/client/views/list-deadlines.client.view.html'
      })
      .state('deadlines.create', {
        url: '/create',
        templateUrl: 'modules/deadlines/client/views/create-deadline.client.view.html',
        data: {
          roles: ['doc', 'ata', 'admin']
        }
      })
      .state('deadlines.view', {
        url: '/:deadlineId',
        templateUrl: 'modules/deadlines/client/views/view-deadline.client.view.html'
      })
      .state('deadlines.edit', {
        url: '/:deadlineId/edit',
        templateUrl: 'modules/deadlines/client/views/edit-deadline.client.view.html',
        data: {
          roles: ['ata', 'doc', 'admin']
        }
      });
  }
]);
