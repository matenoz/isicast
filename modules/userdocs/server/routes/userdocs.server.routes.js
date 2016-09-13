'use strict';

/**
 * Module dependencies.
 */
var userdocsPolicy = require('../policies/userdocs.server.policy'),
  userdocs = require('../controllers/userdocs.server.controller');

module.exports = function (app) {
  // Userdocs collection routes
  app.route('/api/userdocs').all(userdocsPolicy.isAllowed)
    .get(userdocs.list)
    .post(userdocs.create);

  // Single userdoc routes
  app.route('/api/userdocs/:userdocId').all(userdocsPolicy.isAllowed)
    .get(userdocs.read)
    .put(userdocs.update)
    .delete(userdocs.delete);

  // Finish by binding the userdoc middleware
  app.param('userdocId', userdocs.userdocByID);
};
