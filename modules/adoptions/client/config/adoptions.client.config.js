'use strict';

// Configuring the Adoptions module
angular.module('adoptions').run(['Menus',
  function (Menus) {
    // Add the adoptions dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Adozioni',
      state: 'adoptions',
      type: 'dropdown',
      roles: ['org','admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'adoptions', {
      title: 'Elenca',
      state: 'adoptions.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'adoptions', {
      title: 'Crea Adozioni',
      state: 'adoptions.create',
      roles: ['org','admin']
    });
  }
]);
