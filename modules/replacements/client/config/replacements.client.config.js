'use strict';

// Configuring the Replacements module
angular.module('replacements').run(['Menus',
  function (Menus) {
    // Add the replacements dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Replacements',
      state: 'replacements',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'replacements', {
      title: 'List Replacements',
      state: 'replacements.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'replacements', {
      title: 'Create Replacements',
      state: 'replacements.create',
      roles: ['user']
    });
  }
]);
