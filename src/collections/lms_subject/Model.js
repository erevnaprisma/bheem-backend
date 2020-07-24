const mongoose = require('mongoose')
const Joi = require('@hapi/joi')

const schema = new mongoose.Schema({
  title: {
    type: String,
    default: new Date().getTime(),
    unique: true
  },
  content1: {
    type: String,
    default: new Date().getTime()
  },
  start_date: {
    type: Number,
    default: null
  },
  end_date: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
  },
  course_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'lms_course',
    default: null
  },
  created_at: {
    type: Number,
    default: new Date().getTime()
  },
  updated_at: {
    type: Number,
    default: new Date().getTime()
  },
  created_by: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    default: null
  },
  updated_by: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    default: null
  }
}
)
// schema.statics.validation = (args) => Joi.object({
//   // user_id: Joi.string(),
//   // amount: Joi.number().required().greater(0)
// }).validate(args)

module.exports = mongoose.model('lms_subject', schema)
