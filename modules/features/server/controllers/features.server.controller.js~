'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Feature = mongoose.model('Feature'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a feature
 */
exports.create = function (req, res) {
  var feature = new Feature(req.body);
  feature.user = req.user;

  feature.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(feature);
    }
  });
};

/**
 * Show the current feature
 */
exports.read = function (req, res) {
  res.json(req.feature);
};

/**
 * Update a feature
 */
exports.update = function (req, res) {
  var feature = req.feature;

  feature.title = req.body.title;
  feature.content = req.body.content;

  feature.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(feature);
    }
  });
};

/**
 * Delete an feature
 */
exports.delete = function (req, res) {
  var feature = req.feature;

  feature.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(feature);
    }
  });
};

/**
 * List of Features
 */
exports.list = function (req, res) {
  Feature.find().sort('-created').populate('user', 'displayName').exec(function (err, features) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(features);
    }
  });
};

/**
 * Feature middleware
 */
exports.featureByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Feature is invalid'
    });
  }

  Feature.findById(id).populate('user', 'displayName').exec(function (err, feature) {
    if (err) {
      return next(err);
    } else if (!feature) {
      return res.status(404).send({
        message: 'No feature with that identifier has been found'
      });
    }
    req.feature = feature;
    next();
  });
};
