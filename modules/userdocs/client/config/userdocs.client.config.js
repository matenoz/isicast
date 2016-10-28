'use strict';

// Configuring the Userdocs module
angular.module('userdocs').run(['Menus',
  function (Menus) {
    // Add the userdocs dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Doc. riservati',
      state: 'userdocs',
      type: 'dropdown',
      roles: ['doc','org']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'userdocs', {
      title: 'Elenca',
      state: 'userdocs.list',
      roles: ['doc','org']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'userdocs', {
      title: 'Crea',
      state: 'userdocs.create',
      roles: ['org']
    });
  }
]);
