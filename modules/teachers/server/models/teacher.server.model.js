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
    subclass:{
      type:String,
      default:'',
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
  notes: {
    type:String,
    default:'',
    trim:true
  },
  timetable:[{
    hour:{
      type:String,
      trim:true,
      default:''
    },
    day:{
      type:String,
      trim:true,
      default:''
    },
    classe:{
      type:String,
      trim:true,
      default:''
    },
    subclass:{
      type:String,
      trim:true,
      default:''
    },
    subject:{
      type:String,
      trim:true,
      default:''
    },
    availability:{
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
