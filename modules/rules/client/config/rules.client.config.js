'use strict';

// Configuring the Rules module
angular.module('rules').run(['Menus',
  function (Menus) {
    // Add the rules dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Offerta',
      state: 'rules',
      type: 'dropdown',
      roles: ['god']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'rules', {
      title: 'Elenca',
      state: 'rules.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'rules', {
      title: 'Crea',
      state: 'rules.create',
      roles: ['god']
    });
  }
]);
