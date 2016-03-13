'use strict';

// Configuring the Docs module
angular.module('docs').run(['Menus',
  function (Menus) {
    // Add the docs dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Documenti',
      state: 'docs',
      type: 'dropdown',
      roles: ['public']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'docs', {
      title: 'Elenco',
      state: 'docs.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'docs', {
      title: 'Crea',
      state: 'docs.create',
      roles: ['public']
    });
    Menus.addSubMenuItem('topbar', 'docs', {
      title: 'Genitori',
      state: 'docs.parents'
    });  
  }
]);
