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
  indirizzo: {
    type: String,
    default: '',
    trim: true
  },
  docenti: {
    type:Array,
    default:[]
  },
  coordinatore:{
    type: String,
    default:'',
    trim: true
  },
  timetable :[{
    nome_ora:{
      type:String,
      trim:true,
      default:''
    },
    lunedi:{
      type:String,
      trim:true,
      default:''
    },
    martedi:{
      type:String,
      trim:true,
      default:''
    },
    mercoledi:{
      type:String,
      trim:true,
      default:''
    },
    giovedi:{
      type:String,
      trim:true,
      default:''
    },
    venerdi:{
      type:String,
      trim:true,
      default:''
    }
  }],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }  
});

mongoose.model('Classe', ClasseSchema);
