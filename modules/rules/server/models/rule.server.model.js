'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Rule Schema
 */
var RuleSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date
  },  
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  document: {
    type: Array,
    trim: true
  },
  link: {
    type: String,
    trim: true
  },  
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Rule', RuleSchema);
