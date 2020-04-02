const mongoose = require('mongoose')
const Joi = require('@hapi/joi')

const transactionSchema = new mongoose.Schema({
  merchant_id: {
    type: String,
    ref: 'Merchant',
    default: null
  },
  emoney_id: {
    type: String,
    ref: 'Emoney',
    default: null
  },
  qr_id: {
    type: String,
    ref: 'Qr',
    default: null
  },
  user_id: {
    type: String,
    ref: 'User',
    default: null
  },
  transaction_id: {
    type: String,
    unique: true
  },
  transaction_method: {
    type: String,
    enum: ['Top-up', 'E-money'],
    default: 'E-money'
  },
  transaction_amount: {
    type: Number,
    min: 1,
    default: null
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
    enum: ['PNDNG', 'SETLD', 'REJEC', 'CANCEL'],
    default: 'PNDNG'
  }
})

transactionSchema.statics.validation = (args) => {
  const schema = Joi.object({
    user_id: Joi.string().required(),
    billing_id: Joi.string().required(),
  })

  return schema.validate(args)
}

module.exports = mongoose.model('Transaction', transactionSchema)
