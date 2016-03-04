'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Replacement Schema
 */
var ReplacementSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  rep_date: {
    type: Date,
    trim: true,
    required: 'Date cannot be blank'
  },
  daily_reps:[{
    hour:{
      type:String,
      trim:true
    },
    classe:{
      type:String,
      trim:true
    },
    absent:{
      type:String,
      trim:true
    },
    substitute:{
      type:String,
      trim:true
    },
    isActive:{
      type:Boolean,
      trim:true,
      default:true
    }   
  }],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Replacement', ReplacementSchema);
