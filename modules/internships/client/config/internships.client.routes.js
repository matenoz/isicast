'use strict';

// Setting up route
angular.module('internships').config(['$stateProvider',
  function ($stateProvider) {
    // Internships state routing
    $stateProvider
      .state('internships', {
        abstract: true,
        url: '/internships',
        template: '<ui-view/>'
      })
      .state('internships.list', {
        url: '',
        templateUrl: 'modules/internships/client/views/list-internships.client.view.html'
      })
      .state('internships.create', {
        url: '/create',
        templateUrl: 'modules/internships/client/views/create-internship.client.view.html',
        data: {
          roles: ['alt', 'admin']
        }
      })
      .state('internships.view', {
        url: '/:internshipId',
        templateUrl: 'modules/internships/client/views/view-internship.client.view.html'
      })
      .state('internships.edit', {
        url: '/:internshipId/edit',
        templateUrl: 'modules/internships/client/views/edit-internship.client.view.html',
        data: {
          roles: ['alt', 'admin']
        }
      });
  }
]);
