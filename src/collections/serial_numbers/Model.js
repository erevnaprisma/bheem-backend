const mongoose = require('mongoose')

const { generateRandomString } = require('../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../utils/constants/number')

const qrSchema = new mongoose.Schema({
  serial_id: {
    type: String
  },
  serial_number: {
    type: String
  },
  created_at: {
    type: String
  },
  updated_at: {
    type: String
  }
})

module.exports = mongoose.model('Serial', qrSchema)
