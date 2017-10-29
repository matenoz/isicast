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
      .state('teachers.admin', {
        url: '/admin',
        templateUrl: 'modules/teachers/client/views/admin-list-teachers.client.view.html',
        data: {
          roles: ['god', 'admin']
        }
      })
      .state('teachers.create', {
        url: '/create',
        templateUrl: 'modules/teachers/client/views/create-teacher.client.view.html',
        data: {
          roles: ['god', 'admin']
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
          roles: ['god', 'admin']
        }
      })
      .state('absences', {
        abstract: true,
        url: '/absences',
        template: '<ui-view/>'
      })
      .state('absences.list', {
        url: '',
        templateUrl: 'modules/teachers/client/views/list-absences.client.view.html',
        data: {
          roles: ['abs', 'admin','sost']
        }
      })
      .state('absences.view', {
        url: '/:teacherId',
        templateUrl: 'modules/teachers/client/views/view-absence.client.view.html',
        data: {
          roles: ['abs','sost','admin']
        }
      })
      .state('absences.edit', {
        url: '/:teacherId/edit',
        templateUrl: 'modules/teachers/client/views/edit-absence.client.view.html',
        data: {
          roles: ['abs', 'admin']
        }
      })
      .state('timetables', {
        abstract: true,
        url: '/timetables',
        template: '<ui-view/>'
      })
      .state('timetables.list', {
        url: '',
        templateUrl: 'modules/teachers/client/views/list-timetables.client.view.html'
      })
      .state('timetables.dis', {
        url: '/disposizioni',
        templateUrl: 'modules/teachers/client/views/disp-timetable.view.html'
      })
    /* .state('timetables.global', {
     *   url: '/globalview',
     *   templateUrl: 'modules/teachers/client/views/global-timetable.view.html'
     * })*/
      .state('timetables.view', {
        url: '/:teacherId',
        templateUrl: 'modules/teachers/client/views/view-timetable.client.view.html'
      })
     .state('timetables.edit', {
       url: '/:teacherId/edit',
       templateUrl: 'modules/teachers/client/views/edit-timetable.client.view.html',
       data: {
         roles: ['god', 'admin']
       }
     });
  }
]);
