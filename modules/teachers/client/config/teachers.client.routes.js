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
      })
      .state('absences', {
        abstract: true,
        url: '/absences',
        template: '<ui-view/>'
      })
      .state('absences.list', {
        url: '',
        templateUrl: 'modules/teachers/client/views/list-absences.client.view.html'
      })
      .state('absences.view', {
        url: '/:teacherId',
        templateUrl: 'modules/teachers/client/views/view-absence.client.view.html'
      })
      .state('absences.edit', {
        url: '/:teacherId/edit',
        templateUrl: 'modules/teachers/client/views/edit-absence.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
