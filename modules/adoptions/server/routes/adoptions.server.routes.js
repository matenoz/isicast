'use strict';

/**
 * Module dependencies.
 */
var adoptionsPolicy = require('../policies/adoptions.server.policy'),
  adoptions = require('../controllers/adoptions.server.controller');

module.exports = function (app) {
  // Adoptions collection routes
  app.route('/api/adoptions').all(adoptionsPolicy.isAllowed)
    .get(adoptions.list)
    .post(adoptions.create);

  // Single adoption routes
  app.route('/api/adoptions/:adoptionId').all(adoptionsPolicy.isAllowed)
    .get(adoptions.read)
    .put(adoptions.update)
    .delete(adoptions.delete);

  // Finish by binding the adoption middleware
  app.param('adoptionId', adoptions.adoptionByID);
};
