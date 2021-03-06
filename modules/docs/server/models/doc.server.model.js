'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Doc Schema
 */
var DocSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  prot:  {
    type:Number,
    required:'protocoll cannot be blank'
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Object cannot be blank'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  main_doc:{
    type:Array,
    default:[],
    trim:true
  },  
  attachment:{
    type:Array,
    default:[],
    trim:true
  },
  tags:{
    type:Array,
    default:[],
    trim:true
  },  
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Doc', DocSchema);
