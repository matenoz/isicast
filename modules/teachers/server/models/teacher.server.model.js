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
    type: String,
    default: '',
    trim: true
  },
  coordinator:{
    type:String,
    default:'',
    trim:true
  },
  classes:{
    type:Array,
    default:[]
  },
  teacher_timetable: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher_timetable'
  },
    user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Teacher', TeacherSchema);
