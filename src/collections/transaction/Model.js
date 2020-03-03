const mongoose = require('mongoose')

const { generateRandomString } = require('../../utils/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../../constants/number')

const transactionSchema = new mongoose.Schema({
  transaction_id: {
    type: String,
    default: new Date().getTime() + generateRandomString(RANDOM_STRING_FOR_CONCAT)
  },
  transaction_amount: {
    type: Number
  },
  merchant_id: {
    type: mongoose.Schema.Types.ObjectId
  },
  billing_id: {
    type: String,
    default: new Date().getTime() + generateRandomString(RANDOM_STRING_FOR_CONCAT)
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
