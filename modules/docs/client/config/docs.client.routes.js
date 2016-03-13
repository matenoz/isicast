'use strict';

// Setting up route
angular.module('docs').config(['$stateProvider',
  function ($stateProvider) {
    // Docs state routing
    $stateProvider
      .state('docs', {
        abstract: true,
        url: '/docs',
        template: '<ui-view/>'
      })
      .state('docs.list', {
        url: '',
        templateUrl: 'modules/docs/client/views/list-docs.client.view.html'
      })
      .state('docs.parents', {
        url: '/parents',
        templateUrl: 'modules/docs/client/views/parents-docs.client.view.html'
      })
      .state('docs.create', {
        url: '/create',
        templateUrl: 'modules/docs/client/views/create-doc.client.view.html',
        data: {
          roles: ['public', 'admin']
        }
      })
      .state('docs.view', {
        url: '/:docId',
        templateUrl: 'modules/docs/client/views/view-doc.client.view.html'
      })
      .state('docs.edit', {
        url: '/:docId/edit',
        templateUrl: 'modules/docs/client/views/edit-doc.client.view.html',
        data: {
          roles: ['public', 'admin']
        }
      });
  }
]);
