const mongoose = require('mongoose')
const { generateRandomString } = require('../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../utils/constants/number')

const qrSchema = new mongoose.Schema({
  qr_id: {
    type: String
  },
  created_at: {
    type: String,
    default: new Date().getTime() + generateRandomString(RANDOM_STRING_FOR_CONCAT)
  },
  updated_at: {
    type: String,
    default: new Date().getTime() + generateRandomString(RANDOM_STRING_FOR_CONCAT)
  }
})

module.exports = mongoose.model('QR', qrSchema)
