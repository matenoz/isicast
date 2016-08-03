'use strict';

// Setting up route
angular.module('adoptions').config(['$stateProvider',
  function ($stateProvider) {
    // Adoptions state routing
    $stateProvider
      .state('adoptions', {
        abstract: true,
        url: '/adoptions',
        template: '<ui-view/>'
      })
      .state('adoptions.list', {
        url: '',
        templateUrl: 'modules/adoptions/client/views/list-adoptions.client.view.html'
      })
      .state('adoptions.create', {
        url: '/create',
        templateUrl: 'modules/adoptions/client/views/create-adoption.client.view.html',
        data: {
          roles: ['org', 'admin']
        }
      })
      .state('adoptions.view', {
        url: '/:adoptionId',
        templateUrl: 'modules/adoptions/client/views/view-adoption.client.view.html'
      })
      .state('adoptions.edit', {
        url: '/:adoptionId/edit',
        templateUrl: 'modules/adoptions/client/views/edit-adoption.client.view.html',
        data: {
          roles: ['org', 'admin']
        }
      });
  }
]);
