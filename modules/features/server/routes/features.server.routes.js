'use strict';

/**
 * Module dependencies.
 */
var featuresPolicy = require('../policies/features.server.policy'),
  features = require('../controllers/features.server.controller');

module.exports = function (app) {
  // Features collection routes
  app.route('/api/features').all(featuresPolicy.isAllowed)
    .get(features.list)
    .post(features.create);

  // Single feature routes
  app.route('/api/features/:featureId').all(featuresPolicy.isAllowed)
    .get(features.read)
    .put(features.update)
    .delete(features.delete);

  // Finish by binding the feature middleware
  app.param('featureId', features.featureByID);
};
