const mongoose = require('mongoose')

const User = require('../user/Model')
const { generateID } = require('../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../utils/constants/number')

const emoneySchema = new mongoose.Schema({
  emoney_id: {
    type: String,
    default: generateID(RANDOM_STRING_FOR_CONCAT)
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
    default: new Date().getTime()
  },
  updated_at: {
    type: String,
    default: new Date().getTime()
  },
  type: {
    type: String,
    enum: ['CREDIT', 'DEBIT']
  }
})

module.exports = mongoose.model('Emoney', emoneySchema)
