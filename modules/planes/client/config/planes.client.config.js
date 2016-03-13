'use strict';

// Configuring the Planes module
angular.module('planes').run(['Menus',
  function (Menus) {
    // Add the planes dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Programmazioni',
      state: 'planes',
      type: 'dropdown',
      roles: ['doc']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'planes', {
      title: 'Elenco',
      state: 'planes.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'planes', {
      title: 'Crea',
      state: 'planes.create',
      roles: ['doc']
    });
  }
]);
