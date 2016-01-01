'use strict';

// Setting up route
angular.module('class_timetables').config(['$stateProvider',
  function ($stateProvider) {
    // Class_timetables state routing
    $stateProvider
      .state('class_timetables', {
        abstract: true,
        url: '/class_timetables',
        template: '<ui-view/>'
      })
      .state('class_timetables.list', {
        url: '',
        templateUrl: 'modules/class_timetables/client/views/list-class_timetables.client.view.html'
      })
      .state('class_timetables.create', {
        url: '/create',
        templateUrl: 'modules/class_timetables/client/views/create-class_timetable.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('class_timetables.view', {
        url: '/:class_timetableId',
        templateUrl: 'modules/class_timetables/client/views/view-class_timetable.client.view.html'
      })
      .state('class_timetables.edit', {
        url: '/:class_timetableId/edit',
        templateUrl: 'modules/class_timetables/client/views/edit-class_timetable.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
