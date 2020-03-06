const mongoose = require('mongoose')
const Joi = require('@hapi/joi')

const User = require('../user/Model')

const emoneySchema = new mongoose.Schema({
  emoney_id: {
    type: String
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User
  },
  transaction_amount: {
    type: Number
  },
  saldo: {
    type: Number,
    default: 0
  },
  created_at: {
    type: String,
    default: null
  },
  updated_at: {
    type: String,
    default: null
  },
  type: {
    type: String,
    enum: ['CREDIT', 'DEBIT']
  }
})

emoneySchema.statics.validation = (args) => {
  const schema = Joi.object({
    user_id: Joi.string().required(),
    transaction_amount: Joi.number().required(),
    type: Joi.string().required(),
    saldo: Joi.number().required()
  })

  return schema.validate(args)
}

module.exports = mongoose.model('Emoney', emoneySchema)
