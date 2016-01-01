'use strict';

/**
 * Module dependencies.
 */
var deadlinesPolicy = require('../policies/deadlines.server.policy'),
  deadlines = require('../controllers/deadlines.server.controller');

module.exports = function (app) {
  // Deadlines collection routes
  app.route('/api/deadlines').all(deadlinesPolicy.isAllowed)
    .get(deadlines.list)
    .post(deadlines.create);

  // Single deadline routes
  app.route('/api/deadlines/:deadlineId').all(deadlinesPolicy.isAllowed)
    .get(deadlines.read)
    .put(deadlines.update)
    .delete(deadlines.delete);

  // Finish by binding the deadline middleware
  app.param('deadlineId', deadlines.deadlineByID);
};
