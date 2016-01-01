'use strict';

// Configuring the Deadlines module
angular.module('deadlines').run(['Menus',
  function (Menus) {
    // Add the deadlines dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Deadlines',
      state: 'deadlines',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'deadlines', {
      title: 'List Deadlines',
      state: 'deadlines.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'deadlines', {
      title: 'Create Deadlines',
      state: 'deadlines.create',
      roles: ['user']
    });
  }
]);
