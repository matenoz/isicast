'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Teacher Schema
 */
var TeacherSchema = new Schema({
  
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Name cannot be blank'
  },
  materia: {
    type: Array,
    trim: true
  },
  coordinator:{
    type:String,
    default:'',
    trim:true
  },
  classes:[{
    name:{
      type:String,
      trim:true
    },
    indirizzo:{
      type:String,
      trim:true
    },
    isActive:{
      type:Boolean,
      trim:true,
      default:true
    }   
  }],
  absences:[{
    date:{
      type:Date,
      trim:true
    },
    cause:{
      type:String,
      trim:true
    },
    type:{
      type:String,
      trim:true
    }  
  }],
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

mongoose.model('Teacher', TeacherSchema);
