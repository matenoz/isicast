'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Replacement = mongoose.model('Replacement'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a replacement
 */
exports.create = function (req, res) {
  var replacement = new Replacement(req.body);
  replacement.user = req.user;

  replacement.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(replacement);
    }
  });
};

/**
 * Show the current replacement
 */
exports.read = function (req, res) {
  res.json(req.replacement);
};

/**
 * Update a replacement
 */
exports.update = function (req, res) {
  var replacement = req.replacement;

  replacement.rep_date = req.body.rep_date;
  replacement.daily_reps = req.body.daily_reps;

  replacement.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(replacement);
    }
  });
};

/**
 * Delete an replacement
 */
exports.delete = function (req, res) {
  var replacement = req.replacement;

  replacement.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(replacement);
    }
  });
};

/**
 * List of Replacements
 */
exports.list = function (req, res) {
  Replacement.find().sort('-created').populate('user', 'displayName').exec(function (err, replacements) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(replacements);
    }
  });
};

/**
 * Replacement middleware
 */
exports.replacementByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Replacement is invalid'
    });
  }

  Replacement.findById(id).populate('user', 'displayName').exec(function (err, replacement) {
    if (err) {
      return next(err);
    } else if (!replacement) {
      return res.status(404).send({
        message: 'No replacement with that identifier has been found'
      });
    }
    req.replacement = replacement;
    next();
  });
};
