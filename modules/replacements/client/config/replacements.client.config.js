'use strict';

// Configuring the Replacements module
angular.module('replacements').run(['Menus',
  function (Menus) {
    // Add the replacements dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Sostituzioni',
      state: 'replacements',
      type: 'dropdown',
      roles: ['sost']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'replacements', {
      title: 'Elenco',
      state: 'replacements.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'replacements', {
      title: 'Crea',
      state: 'replacements.create',
      roles: ['sost']
    });
  }
]);
