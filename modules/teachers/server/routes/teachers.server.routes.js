'use strict';

/**
 * Module dependencies.
 */
var teachersPolicy = require('../policies/teachers.server.policy'),
  teachers = require('../controllers/teachers.server.controller');

module.exports = function (app) {
  // Teachers collection routes
  app.route('/api/teachers').all(teachersPolicy.isAllowed)
    .get(teachers.list)
    .post(teachers.create);

  // Single teacher routes
  app.route('/api/teachers/:teacherId').all(teachersPolicy.isAllowed)
    .get(teachers.read)
    .put(teachers.update)
    .delete(teachers.delete);

  // Finish by binding the teacher middleware
  app.param('teacherId', teachers.teacherByID);
};
