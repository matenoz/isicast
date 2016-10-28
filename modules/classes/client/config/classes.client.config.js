'use strict';

// Configuring the Classes module
angular.module('classes').run(['Menus',
  function (Menus) {
    // Add the classes dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Classi',
      state: 'classes',
      type: 'dropdown',
      roles: ['god','admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'classes', {
      title: 'Elenco',
      state: 'classes.list'
    });
    Menus.addSubMenuItem('topbar', 'classes', {
      title: 'Lista admin',
      state: 'classes.admin',
      roles: ['god','admin']
    });
    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'classes', {
      title: 'Crea Classe',
      state: 'classes.create',
      roles: ['god','admin']
    });
 
    Menus.addSubMenuItem('topbar', 'classes', {
      title: 'Orario',
      state: 'ctimetables.list',
      roles: ['god','admin']
    });   
  }
]);
