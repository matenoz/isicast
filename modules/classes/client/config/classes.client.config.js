'use strict';

// Configuring the Classes module
angular.module('classes').run(['Menus',
  function (Menus) {
    // Add the classes dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Classi',
      state: 'classes',
      type: 'dropdown',
      roles: ['god']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'classes', {
      title: 'Elenco',
      state: 'classes.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'classes', {
      title: 'Crea Classe',
      state: 'classes.create',
      roles: ['god']
    });
 
    Menus.addSubMenuItem('topbar', 'classes', {
      title: 'Orario',
      state: 'ctimetables.list',
      roles: ['god']
    });   
  }
]);
