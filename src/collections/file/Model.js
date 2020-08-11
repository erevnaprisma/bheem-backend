const mongoose = require('mongoose')
const Joi = require('@hapi/joi')

const schema = new mongoose.Schema({
  filename: {
    type: String,
    default: new Date().getTime(),
    unique: true
  },
  file_type: {
    type: String
  },
  file_size: {
    type: Number
  },
  mtime: {
    type: String
  },
  filenameorigin: {
    type: String,
    default: new Date().getTime()
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

module.exports = mongoose.model('File', schema)
