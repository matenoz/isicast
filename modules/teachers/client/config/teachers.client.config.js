'use strict';

// Configuring the Teachers module
angular.module('teachers').run(['Menus',
  function (Menus) {
    // Add the teachers dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Docenti',
      state: 'teachers',
      type: 'dropdown',
      roles: ['admin','god','abs','sost']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'teachers', {
      title: 'Elenco',
      state: 'teachers.list'
    });
            
    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'teachers', {
      title: 'Crea',
      state: 'teachers.create',
      roles: ['god','admin']
    });

    Menus.addSubMenuItem('topbar', 'teachers', {
      title: 'Lista admin',
      state: 'teachers.admin',
      roles: ['god','admin']
    });

    Menus.addSubMenuItem('topbar', 'teachers', {
      title: 'Assenze',
      state: 'absences.list',
      roles: ['admin','abs', 'sost']
    });
      
    Menus.addSubMenuItem('topbar', 'teachers', {
      title: 'Orario',
      state: 'timetables.list',
      roles: ['god','admin']
    });

    Menus.addSubMenuItem('topbar', 'teachers', {
      title: 'Disposizioni',
      state: 'timetables.dis',
    });
    Menus.addSubMenuItem('topbar', 'teachers', {
      title: 'G view',
      state: 'timetables.global'
    });
  }
]);
