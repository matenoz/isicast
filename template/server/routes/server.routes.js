'use strict';

/**
 * Module dependencies.
 */
var classesPolicy = require('../policies/classes.server.policy'),
  classes = require('../controllers/classes.server.controller');

module.exports = function (app) {
  // Classes collection routes
  app.route('/api/classes').all(classesPolicy.isAllowed)
    .get(classes.list)
    .post(classes.create);

  // Single classe routes
  app.route('/api/classes/:classeId').all(classesPolicy.isAllowed)
    .get(classes.read)
    .put(classes.update)
    .delete(classes.delete);

  // Finish by binding the classe middleware
  app.param('classeId', classes.classeByID);
};
