'use strict';

// Setting up route
angular.module('replacements').config(['$stateProvider',
  function ($stateProvider) {
    // Replacements state routing
    $stateProvider
      .state('replacements', {
        abstract: true,
        url: '/replacements',
        template: '<ui-view/>'
      })
      .state('replacements.list', {
        url: '',
        templateUrl: 'modules/replacements/client/views/list-replacements.client.view.html'
      })
      .state('replacements.create', {
        url: '/create',
        templateUrl: 'modules/replacements/client/views/create-replacement.client.view.html',
        data: {
          roles: ['sost', 'admin']
        }
      })
      .state('replacements.view', {
        url: '/:replacementId',
        templateUrl: 'modules/replacements/client/views/view-replacement.client.view.html'
      })
      .state('replacements.edit', {
        url: '/:replacementId/edit',
        templateUrl: 'modules/replacements/client/views/edit-replacement.client.view.html',
        data: {
          roles: ['sost', 'admin']
        }
      });
  }
]);
