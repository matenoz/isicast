'use strict';

// Configuring the Features module
angular.module('features').run(['Menus',
  function (Menus) {
    // Add the features dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Features',
      state: 'features',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'features', {
      title: 'List Features',
      state: 'features.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'features', {
      title: 'Create Features',
      state: 'features.create',
      roles: ['user']
    });
  }
]);
