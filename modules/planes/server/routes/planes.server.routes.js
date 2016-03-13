'use strict';

/**
 * Module dependencies.
 */
var planesPolicy = require('../policies/planes.server.policy'),
  planes = require('../controllers/planes.server.controller');

module.exports = function (app) {
  // Planes collection routes
  app.route('/api/planes').all(planesPolicy.isAllowed)
    .get(planes.list)
    .post(planes.create);

  // Single plane routes
  app.route('/api/planes/:planeId').all(planesPolicy.isAllowed)
    .get(planes.read)
    .put(planes.update)
    .delete(planes.delete);

  // Finish by binding the plane middleware
  app.param('planeId', planes.planeByID);
};
