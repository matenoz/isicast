'use strict';

// Configuring the Rules module
angular.module('rules').run(['Menus',
  function (Menus) {
    // Add the rules dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Rules',
      state: 'rules',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'rules', {
      title: 'List Rules',
      state: 'rules.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'rules', {
      title: 'Create Rules',
      state: 'rules.create',
      roles: ['user']
    });
  }
]);
