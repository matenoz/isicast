'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Plane Schema
 */
var PlaneSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date
  },
  content: {
    type: Array,
    trim: true
  },
  classes: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },  
  year: {
    type: String,
    trim: true
  },  
  materia: {
    type: String,
    trim: true
  },    
  department: {
    type: String,
    default: '',
    trim: true
  },  
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Plane', PlaneSchema);
