const mongoose = require('mongoose')

const Merchant = require('../merchant/Model')
const Emoney = require('../emoney/Model')
const Qr = require('../qr/Model')
const User = require('../user/Model')
const { generateID } = require('../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../utils/constants/number')

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
    type: String,
    default: generateID(RANDOM_STRING_FOR_CONCAT)
  },
  transaction_amount: {
    type: Number
  },
  billing_id: {
    type: String,
    default: null
  },
  created_at: {
    type: String,
    default: new Date().getTime()
  },
  updated_at: {
    type: String,
    default: new Date().getTime()
  },
  status: {
    type: String,
    enum: ['PNDNG', 'SETLD', 'REJEC'],
    default: 'PNDNG'
  }
})

module.exports = mongoose.model('Transaction', transactionSchema)
