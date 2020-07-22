const mongoose = require('mongoose')
const Joi = require('@hapi/joi')

const schema = new mongoose.Schema({
  created_at: {
    type: Number,
    default: new Date().getTime()
  },
  updated_at: {
    type: Number,
    default: new Date().getTime()
  },
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    default: null,
    unique: true
  }
}
)
// schema.statics.validation = (args) => Joi.object({
//   // user_id: Joi.string(),
//   // amount: Joi.number().required().greater(0)
// }).validate(args)

module.exports = mongoose.model('Teacher', schema)
