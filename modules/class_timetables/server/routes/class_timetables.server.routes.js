'use strict';

/**
 * Module dependencies.
 */
var class_timetablesPolicy = require('../policies/class_timetables.server.policy'),
  class_timetables = require('../controllers/class_timetables.server.controller');

module.exports = function (app) {
  // Class_timetables collection routes
  app.route('/api/class_timetables').all(class_timetablesPolicy.isAllowed)
    .get(class_timetables.list)
    .post(class_timetables.create);

  // Single class_timetable routes
  app.route('/api/class_timetables/:class_timetableId').all(class_timetablesPolicy.isAllowed)
    .get(class_timetables.read)
    .put(class_timetables.update)
    .delete(class_timetables.delete);

  // Finish by binding the class_timetable middleware
  app.param('class_timetableId', class_timetables.class_timetableByID);
};
