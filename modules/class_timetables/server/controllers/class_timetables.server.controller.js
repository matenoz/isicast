'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Class_timetable = mongoose.model('Class_timetable'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a class_timetable
 */
exports.create = function (req, res) {
  var class_timetable = new Class_timetable(req.body);
  class_timetable.user = req.user;

  class_timetable.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(class_timetable);
    }
  });
};

/**
 * Show the current class_timetable
 */
exports.read = function (req, res) {
  res.json(req.class_timetable);
};

/**
 * Update a class_timetable
 */
exports.update = function (req, res) {
  var class_timetable = req.class_timetable;

  class_timetable.nome_classe = req.body.nome_classe;
  class_timetable.timetable = req.body.timetable;

  class_timetable.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(class_timetable);
    }
  });
};

/**
 * Delete an class_timetable
 */
exports.delete = function (req, res) {
  var class_timetable = req.class_timetable;

  class_timetable.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(class_timetable);
    }
  });
};

/**
 * List of Class_timetables
 */
exports.list = function (req, res) {
  Class_timetable.find().sort('-created').populate('user', 'displayName').exec(function (err, class_timetables) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(class_timetables);
    }
  });
};

/**
 * Class_timetable middleware
 */
exports.class_timetableByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Class_timetable is invalid'
    });
  }

  Class_timetable.findById(id).populate('user', 'displayName').exec(function (err, class_timetable) {
    if (err) {
      return next(err);
    } else if (!class_timetable) {
      return res.status(404).send({
        message: 'No class_timetable with that identifier has been found'
      });
    }
    req.class_timetable = class_timetable;
    next();
  });
};
