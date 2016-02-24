'use strict';

// Configuring the Classes module
angular.module('classes').run(['Menus',
  function (Menus) {
    // Add the classes dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Classes',
      state: 'classes',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'classes', {
      title: 'List Classes',
      state: 'classes.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'classes', {
      title: 'Create Classes',
      state: 'classes.create',
      roles: ['user']
    });
 
    Menus.addSubMenuItem('topbar', 'classes', {
      title: 'Timetables',
      state: 'ctimetables.list',
      roles: ['user']
    });   
  }
]);
