'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Class_timetable Schema
 */
var Class_timetableSchema = new Schema({

  nome_classe:{
      type:String,
      trim:true,
      required: 'Nome classe cannot be blank'
  },
    timetable :[
	{
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
	}
    ],
  user: {
    type: Schema.ObjectId,
      ref: 'User'
  }
});

mongoose.model('Class_timetable', Class_timetableSchema);
