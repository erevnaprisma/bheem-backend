const mongoose = require('mongoose')
const User = require('../user/Model')
const Transaction = require('../transaction/Model')

const emoneySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User
  },
  bill_id: {
    type: String
  },
  transaction_id: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    ref: Transaction
  },
  transaction_amount: {
    type: Number
  },
  saldo: {
    type: Number
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
