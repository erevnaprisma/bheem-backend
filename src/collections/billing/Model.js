const mongoose = require('mongoose')

const { generateID } = require('../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../utils/constants/number')

const billSchema = new mongoose.Schema({
  bill_id: {
    type: String,
    default: generateID(RANDOM_STRING_FOR_CONCAT)
  },
  amount: {
    type: Number
  }
})

module.exports = mongoose.model('Billing', billSchema)
