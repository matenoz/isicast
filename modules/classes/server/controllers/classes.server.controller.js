'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Classe = mongoose.model('Classe'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a classe
 */
exports.create = function (req, res) {
  var classe = new Classe(req.body);
  classe.user = req.user;

  classe.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(classe);
    }
  });
};

/**
 * Show the current classe
 */
exports.read = function (req, res) {
  res.json(req.classe);
};

/**
 * Update a classe
 */
exports.update = function (req, res) {
  var classe = req.classe;

  classe.nome_classe = req.body.nome_classe;
  classe.indirizzo = req.body.indirizzo;
  classe.teachers = req.body.teachers;  
  classe.isActive = req.body.isActive;
  classe.coordinatore = req.body.coordinatore;
  classe.subclasses = req.body.subclasses;

  classe.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(classe);
    }
  });
};

/**
 * Delete an classe
 */
exports.delete = function (req, res) {
  var classe = req.classe;

  classe.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(classe);
    }
  });
};

/**
 * List of Classes
 */
exports.list = function (req, res) {
  Classe.find().sort('-created').populate('user', 'displayName').exec(function (err, classes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(classes);
    }
  });
};

/**
 * Classe middleware
 */
exports.classeByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Classe is invalid'
    });
  }

  Classe.findById(id).sort('-created').populate('user', 'displayName').exec(function (err, classe) {
    if (err) {
      return next(err);
    } else if (!classe) {
      return res.status(404).send({
        message: 'No classe with that identifier has been found'
      });
    }
    req.classe = classe;
    next();
  });
};
