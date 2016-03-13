'use strict';

// Configuring the Deadlines module
angular.module('deadlines').run(['Menus',
  function (Menus) {
    // Add the deadlines dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Impegni',
      state: 'deadlines',
      type: 'dropdown',
      roles: ['doc', 'ata']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'deadlines', {
      title: 'Agenda',
      state: 'deadlines.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'deadlines', {
      title: 'Crea Impegno',
      state: 'deadlines.create',
      roles: ['doc','ata']
    });
  }
]);
