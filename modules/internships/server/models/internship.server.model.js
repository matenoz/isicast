'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Internship Schema
 */
var InternshipSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    default: '',
    trim: true
  },
  page: {
    type: String,
    default: '',
    trim: true
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  abstract: {
    type: String,
    default: '',
    trim: true
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  activities: {
    type: Array,
    default: [],
    trim: true
  },
  registers: {
    type: Array,
    default: [],
    trim: true
  },
  partners: {
    type: Array,
    default: [],
    trim: true
  },
  sectionimages: {
    type: Array,
    default: [],
    trim: true
  },
  pics: {
    type: Array,
    default: [],
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Internship', InternshipSchema);
