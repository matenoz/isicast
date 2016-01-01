'use strict';

// Configuring the Class_timetables module
angular.module('class_timetables').run(['Menus',
  function (Menus) {
    // Add the class_timetables dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Class_timetables',
      state: 'class_timetables',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'class_timetables', {
      title: 'List Class_timetables',
      state: 'class_timetables.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'class_timetables', {
      title: 'Create Class_timetables',
      state: 'class_timetables.create',
      roles: ['user']
    });
  }
]);
