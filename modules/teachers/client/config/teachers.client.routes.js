'use strict';

// Setting up route
angular.module('teachers').config(['$stateProvider',
  function ($stateProvider) {
    // Teachers state routing
    $stateProvider
      .state('teachers', {
        abstract: true,
        url: '/teachers',
        template: '<ui-view/>'
      })
      .state('teachers.list', {
        url: '',
        templateUrl: 'modules/teachers/client/views/list-teachers.client.view.html'
      })
      .state('teachers.create', {
        url: '/create',
        templateUrl: 'modules/teachers/client/views/create-teacher.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('teachers.view', {
        url: '/:teacherId',
        templateUrl: 'modules/teachers/client/views/view-teacher.client.view.html'
      })
      .state('teachers.edit', {
        url: '/:teacherId/edit',
        templateUrl: 'modules/teachers/client/views/edit-teacher.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
