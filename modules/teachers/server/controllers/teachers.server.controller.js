
'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Teacher = mongoose.model('Teacher'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a teacher
 */
exports.create = function (req, res) {
  var teacher = new Teacher(req.body);
  teacher.user = req.user;
  
  teacher.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(teacher);
    }
  });
};

/**
 * Show the current teacher
 */
exports.read = function (req, res) {
  res.json(req.teacher);
};

/**
 * Update a teacher
 */
exports.update = function (req, res) {
  var teacher = req.teacher;

  teacher.name = req.body.name;
  teacher.materia = req.body.materia;
  teacher.coordinator = req.body.coordinator;
  teacher.classes = req.body.classes;  
  teacher.absences = req.body.absences;
  teacher.timetable = req.body.timetable;

  teacher.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(teacher);
    }
  });
};

/**
 * Delete an teacher
 */
exports.delete = function (req, res) {
  var teacher = req.teacher;

  teacher.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(teacher);
    }
  });
};

/**
 * List of Teachers
 */
exports.list = function (req, res) {
  Teacher.find().sort('-created').populate('user','displayName').exec(function (err, teachers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(teachers);
    }
  });
};

/**
 * Teacher middleware
 */
exports.teacherByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Teacher is invalid'
    });
  }

  Teacher.findById(id).populate('user','displayName').exec(function (err, teacher) {
    if (err) {
      return next(err);
    } else if (!teacher) {
      return res.status(404).send({
        message: 'No teacher with that identifier has been found'
      });
    }
    req.teacher = teacher;
    next();
  });
};
