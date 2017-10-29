'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Internship = mongoose.model('Internship'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a internship
 */
exports.create = function (req, res) {
  var internship = new Internship(req.body);
  internship.user = req.user;

  internship.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(internship);
    }
  });
};

/**
 * Show the current internship
 */
exports.read = function (req, res) {
  res.json(req.internship);
};

/**
 * Update a internship
 */
exports.update = function (req, res) {
  var internship = req.internship;

  internship.type = req.body.type;
  internship.page = req.body.page;
  internship.title = req.body.title;
  internship.abstract = req.body.abstract;
  internship.content = req.body.content;
  internship.description = req.body.description;
  internship.activities = req.body.activities;
  internship.registers = req.body.registers;
  internship.partners = req.body.partners;
  internship.sectionimages = req.body.sectionimages;
  internship.pics = req.body.pics;
  
  internship.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(internship);
    }
  });
};

/**
 * Delete an internship
 */
exports.delete = function (req, res) {
  var internship = req.internship;

  internship.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(internship);
    }
  });
};

/**
 * List of Internships
 */
exports.list = function (req, res) {
  Internship.find().sort('-created').populate('user', 'displayName').exec(function (err, internships) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(internships);
    }
  });
};

/**
 * Internship middleware
 */
exports.internshipByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Internship is invalid'
    });
  }

  Internship.findById(id).populate('user', 'displayName').exec(function (err, internship) {
    if (err) {
      return next(err);
    } else if (!internship) {
      return res.status(404).send({
        message: 'No internship with that identifier has been found'
      });
    }
    req.internship = internship;
    next();
  });
};
