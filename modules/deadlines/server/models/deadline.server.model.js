'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Deadline Schema
 */
var DeadlineSchema = new Schema({
  event_date: {
    type: Date,
    required: 'Event cannot be blank'  
  },
  event: {
    type: String,
    default: '',
    trim: true,
    required: 'Event cannot be blank'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  classes: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Deadline', DeadlineSchema);
