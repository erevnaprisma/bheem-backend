const mongoose = require('mongoose')

const User = require('../user/Model')
const { generateID } = require('../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../utils/constants/number')

const saldoSchema = new mongoose.Schema({
  saldo_id: {
    type: String,
    default: generateID(RANDOM_STRING_FOR_CONCAT)
  },
  saldo: {
    type: Number,
    default: 0
  },
  user_id: {
    type: String,
    ref: User
  }
})

module.exports = mongoose.model('Saldo', saldoSchema)
