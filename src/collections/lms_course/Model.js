const mongoose = require('mongoose')
const Joi = require('@hapi/joi')
const User = require('../user/Model')

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
  content2: {
    type: String,
    default: new Date().getTime()
  },
  content3: {
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
  code: {
    type: String,
    default: new Date().getTime(),
    unique: true
  },
  batch: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['draft', 'publish'],
    default: 'draft'
  },
  instructors: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],
  admins: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],
  students: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],
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

module.exports = mongoose.model('lms_course', schema)
