'use strict';

/**
 * Module dependencies.
 */
var internshipsPolicy = require('../policies/internships.server.policy'),
  internships = require('../controllers/internships.server.controller');

module.exports = function (app) {
  // Internships collection routes
  app.route('/api/internships').all(internshipsPolicy.isAllowed)
    .get(internships.list)
    .post(internships.create);

  // Single internship routes
  app.route('/api/internships/:internshipId').all(internshipsPolicy.isAllowed)
    .get(internships.read)
    .put(internships.update)
    .delete(internships.delete);

  // Finish by binding the internship middleware
  app.param('internshipId', internships.internshipByID);
};
