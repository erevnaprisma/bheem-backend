const mongoose = require('mongoose')
const Joi = require('@hapi/joi')

const Merchant = require('../merchant/Model')
const Emoney = require('../emoney/Model')
const Qr = require('../qr/Model')
const User = require('../user/Model')

const transactionSchema = new mongoose.Schema({
  merchant_id: {
    type: String,
    ref: Merchant,
    default: null
  },
  emoney_id: {
    type: String,
    ref: Emoney,
    default: null
  },
  qr_id: {
    type: String,
    ref: Qr,
    default: null
  },
  user_id: {
    type: String,
    ref: User,
    default: null
  },
  transaction_id: {
    type: String
  },
  transaction_amount: {
    type: Number
  },
  billing_id: {
    type: String,
    default: null
  },
  created_at: {
    type: String
  },
  updated_at: {
    type: String
  },
  status: {
    type: String,
    enum: ['PNDNG', 'SETLD', 'REJEC'],
    default: 'PNDNG'
  }
})

transactionSchema.statics.validation = (args) => {
  const schema = Joi.object({
    user_id: Joi.string().required(),
    billing_id: Joi.string().required(),
    transaction_amount: Joi.number().required()
  })

  return schema.validate(args)
}

module.exports = mongoose.model('Transaction', transactionSchema)
