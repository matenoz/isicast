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
	type:Array, default:['','','','','' ]
  },
   coordinatore:{
    type: String,
    default:'',
    trim: true
   },
   orario_classe:{
    type:Schema.Types.ObjectId,
    ref: 'Class_timetable'
   },
      user: {
    type: Schema.ObjectId,
    ref: 'User'
  }  
});

mongoose.model('Classe', ClasseSchema);
