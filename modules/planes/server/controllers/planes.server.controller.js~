'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Plane = mongoose.model('Plane'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a plane
 */
exports.create = function (req, res) {
  var plane = new Plane(req.body);
  plane.user = req.user;

  plane.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(plane);
    }
  });
};

/**
 * Show the current plane
 */
exports.read = function (req, res) {
  res.json(req.plane);
};

/**
 * Update a plane
 */
exports.update = function (req, res) {
  var plane = req.plane;

  plane.updated = req.body.updated;
  plane.content = req.body.content;
  plane.year = req.body.year;
  plane.department =req.body.department;  
  plane.classes = req.body.classes;
  plane.materia = req.body.materia;  
  plane.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(plane);
    }
  });
};

/**
 * Delete an plane
 */
exports.delete = function (req, res) {
  var plane = req.plane;

  plane.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(plane);
    }
  });
};

/**
 * List of Planes
 */
exports.list = function (req, res) {
  Plane.find().sort('-created').populate('user', 'displayName').exec(function (err, planes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(planes);
    }
  });
};

/**
 * Plane middleware
 */
exports.planeByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Plane is invalid'
    });
  }

  Plane.findById(id).populate('user', 'displayName').exec(function (err, plane) {
    if (err) {
      return next(err);
    } else if (!plane) {
      return res.status(404).send({
        message: 'No plane with that identifier has been found'
      });
    }
    req.plane = plane;
    next();
  });
};
