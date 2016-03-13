'use strict';

// Configuring the Features module
angular.module('features').run(['Menus',
  function (Menus) {
    // Add the features dropdown item
    Menus.addMenuItem('topbar', {
      title: 'News',
      state: 'features',
      type: 'dropdown',
      roles: ['public']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'features', {
      title: 'Archivio',
      state: 'features.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'features', {
      title: 'Crea',
      state: 'features.create',
      roles: ['public']
    });
  }
]);
