'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Classe Schema
 */
var ClasseSchema = new Schema({
  nome_classe: {
    type: String,
    default: '',
    trim: true ,
    required: 'Name cannot be blank'
  },
  subclasses:[{
    name:{
      type:String,
      default:'',
      trim:true
    }
  }],
  indirizzo: {
    type: String,
    default: '',
    trim: true
  },
  teachers: [{
    name:{
      type:String,
      trim:true
    },
    materia:{
      type:String,
      trim:true
    },
    isActive:{
      type:Boolean,
      trim:true,
      default:true
    } 
  }],
  coordinatore:{
    type: String,
    default:'',
    trim: true
  },
  isActive:{
    type:Boolean,
    trim:true,
    default:true
  },  
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }  
});

mongoose.model('Classe', ClasseSchema);
