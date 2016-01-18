'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Feature Schema
 */
var FeatureSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  img: {
    type:String,
    default:'',
    trim:true
  },
  link: {
    type:String,
    default:'',
    trim:true
  },
  deadline:{
    type:Date,
    trim: true
  },
  priority:{
    type:Number,
    default:5,
    trim: true  
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Feature', FeatureSchema);
