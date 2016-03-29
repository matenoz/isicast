'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html'
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html'
      })
      .state('settings.abs', {
        url: '/absences',
        templateUrl: 'modules/teachers/client/views/list-absences.client.view.html',
        data: {
          roles: ['abs', 'admin']
        }
      })
      .state('settings.doc', {
        url: '/docs',
        templateUrl: 'modules/docs/client/views/create-doc.client.view.html',
        data: {
          roles: ['public', 'admin']
        }
      })
      .state('settings.dead', {
        url: '/deadlines',
        templateUrl: 'modules/deadlines/client/views/create-deadline.client.view.html',
        data: {
          roles: ['ata', 'doc', 'admin']
        }
      })
      .state('settings.prog', {
        url: '/planes',
        templateUrl: 'modules/planes/client/views/create-plane.client.view.html',
        data: {
          roles: ['doc', 'admin']
        }
      })
      .state('settings.subs', {
        url: '/replacements',
        templateUrl: 'modules/replacements/client/views/create-replacement.client.view.html',
        data: {
          roles: ['sost', 'admin']
        }
      })
      .state('settings.class', {
        url: '/class',
        templateUrl: 'modules/classes/client/views/create-classe.client.view.html',
        data: {
          roles: ['admin']
        }
      })
      .state('settings.teacher', {
        url: '/teacher',
        templateUrl: 'modules/teachers/client/views/create-teacher.client.view.html',
        data: {
          roles: ['admin']
        }
      })
      .state('settings.fea', {
        url: '/feature',
        templateUrl: 'modules/features/client/views/create-feature.client.view.html',
        data: {
          roles: ['public', 'admin']
        }
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html'
      })
      /*.state('authentication.signup', {
        url: '/signup',
        templateUrl: 'modules/users/client/views/authentication/signup.client.view.html'
      })*/
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/authentication/signin.client.view.html'
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/client/views/password/reset-password.client.view.html'
      });
  }
]);
