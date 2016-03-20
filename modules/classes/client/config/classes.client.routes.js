'use strict';

// Setting up route
angular.module('classes').config(['$stateProvider',
  function ($stateProvider) {
    // Classes state routing
    $stateProvider
      .state('classes', {
        abstract: true,
        url: '/classes',
        template: '<ui-view/>'
      })
      .state('classes.list', {
        url: '',
        templateUrl: 'modules/classes/client/views/list-classes.client.view.html'
      })
      .state('classes.create', {
        url: '/create',
        templateUrl: 'modules/classes/client/views/create-classe.client.view.html',
        data: {
          roles: ['admin','god']
        }
      })
      .state('classes.view', {
        url: '/:classeId',
        templateUrl: 'modules/classes/client/views/view-classe.client.view.html'
      })
      .state('classes.edit', {
        url: '/:classeId/edit',
        templateUrl: 'modules/classes/client/views/edit-classe.client.view.html',
        data: {
          roles: ['admin','god']
        }
      })
      .state('ctimetables', {
        abstract: true,
        url: '/ctimetables',
        template: '<ui-view/>'
      })
      .state('ctimetables.list', {
        url: '',
        templateUrl: 'modules/classes/client/views/list-timetables.client.view.html'
      })
      .state('ctimetables.view', {
        url: '/:classeId',
        templateUrl: 'modules/classes/client/views/view-timetable.client.view.html'
      })
      .state('ctimetables.edit', {
        url: '/:classeId/edit',
        templateUrl: 'modules/classes/client/views/edit-timetable.client.view.html',
        data: {
          roles: ['admin', 'god']
        }
      });
  }
]);
