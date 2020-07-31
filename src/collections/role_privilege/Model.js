const mongoose = require('mongoose')
// const Joi = require('@hapi/joi')
// const User = require('../user/Model')

const schema = new mongoose.Schema({
  role_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'role'
  },
  privilege_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'privilege'
  },
  created_at: {
    type: Number,
    default: new Date().now
  },
  updated_at: {
    type: Number,
    default: new Date().now
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

schema.index({ role_id: 1, privilege_id: 1 }, { unique: true })

module.exports = mongoose.model('role_privilege', schema)
