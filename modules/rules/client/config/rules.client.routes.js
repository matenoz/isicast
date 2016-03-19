'use strict';

// Setting up route
angular.module('rules').config(['$stateProvider',
  function ($stateProvider) {
    // Rules state routing
    $stateProvider
      .state('rules', {
        abstract: true,
        url: '/rules',
        template: '<ui-view/>'
      })
      .state('rules.list', {
        url: '',
        templateUrl: 'modules/rules/client/views/list-rules.client.view.html'
      })
      .state('rules.quest', {
        url: '/quest',
        templateUrl: 'modules/rules/client/views/list-quest.client.view.html'
      })      
      .state('rules.create', {
        url: '/create',
        templateUrl: 'modules/rules/client/views/create-rule.client.view.html',
        data: {
          roles: ['god', 'admin']
        }
      })
      .state('rules.view', {
        url: '/:ruleId',
        templateUrl: 'modules/rules/client/views/view-rule.client.view.html'
      })
      .state('rules.edit', {
        url: '/:ruleId/edit',
        templateUrl: 'modules/rules/client/views/edit-rule.client.view.html',
        data: {
          roles: ['god', 'admin']
        }
      });
  }
]);
