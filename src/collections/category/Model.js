const mongoose = require('mongoose')
const Manifest = require('./manifest')
// const Joi = require('@hapi/joi')
// const User = require('../user/Model')

const schema = new mongoose.Schema({
  title: {
    type: String,
    unique: true
  },
  parent_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: Manifest.collection,
    default: null
  },
  toko_id: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'toko_toko_online' }],
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

module.exports = mongoose.model(Manifest.collection, schema)
