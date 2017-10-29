'use strict';

// Configuring the Internships module
angular.module('internships').run(['Menus',
  function (Menus) {
    // Add the internships dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Scuola Lavoro',
      state: 'internships',
      type: 'dropdown',
      roles: ['alt']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'internships', {
      title: 'Visualizza',
      state: 'internships.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'internships', {
      title: 'Create Internships',
      state: 'internships.create',
      roles: ['admin']
    });
  }
]);
