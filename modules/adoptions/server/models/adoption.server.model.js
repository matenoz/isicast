'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Adoption Schema
 */
var AdoptionSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  classe: {
    type: String,
    default: '',
    trim: true,
    required: 'Classe cannot be blank'
  },
  address: {
    type: String,
    default: '',
    trim: true,
    required: 'Address cannot be blank'
  },
  document: {
    type: Array,
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Adoption', AdoptionSchema);
