'use strict';

// Configuring the Teachers module
angular.module('teachers').run(['Menus',
  function (Menus) {
    // Add the teachers dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Teachers',
      state: 'teachers',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'teachers', {
      title: 'List Teachers',
      state: 'teachers.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'teachers', {
      title: 'Create Teachers',
      state: 'teachers.create',
      roles: ['user']
    });
  }
]);
