'use strict';

// Configuring the Docs module
angular.module('docs').run(['Menus',
  function (Menus) {
    // Add the docs dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Docs',
      state: 'docs',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'docs', {
      title: 'List Docs',
      state: 'docs.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'docs', {
      title: 'Create Docs',
      state: 'docs.create',
      roles: ['user']
    });
    Menus.addSubMenuItem('topbar', 'docs', {
      title: 'genitori',
      state: 'docs.parents'
    });  
  }
]);
