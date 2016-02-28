'use strict';

/**
 * Module dependencies.
 */
var replacementsPolicy = require('../policies/replacements.server.policy'),
  replacements = require('../controllers/replacements.server.controller');

module.exports = function (app) {
  // Replacements collection routes
  app.route('/api/replacements').all(replacementsPolicy.isAllowed)
    .get(replacements.list)
    .post(replacements.create);

  // Single replacement routes
  app.route('/api/replacements/:replacementId').all(replacementsPolicy.isAllowed)
    .get(replacements.read)
    .put(replacements.update)
    .delete(replacements.delete);

  // Finish by binding the replacement middleware
  app.param('replacementId', replacements.replacementByID);
};
