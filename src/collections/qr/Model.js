const mongoose = require('mongoose')

const { generateRandomString } = require('../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../utils/constants/number')

const qrValue = new mongoose.Schema({
  merchant_id_native: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Merchant',
    default: null
  },
  institution_id_native: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Institution',
    default: null
  },
  merchant_id: {
    type: String,
    ref: 'Merchant',
    default: null
  },
  merchant_name: {
    type: String,
    ref: 'Merchant',
    default: null
  },
  qr_id: {
    type: String
  },
  type: {
    type: String
  },
  institution_id: {
    type: String,
    ref: 'Institution',
    default: null
  }
})

const qrSchema = new mongoose.Schema({
  qr_id: {
    type: String
  },
  qr_value: {
    type: { qrValue },
    default: null
  },
  created_at: {
    type: String,
    default: new Date().getTime() + generateRandomString(RANDOM_STRING_FOR_CONCAT)
  },
  updated_at: {
    type: String,
    default: new Date().getTime() + generateRandomString(RANDOM_STRING_FOR_CONCAT)
  },
  type: {
    type: String,
    enum: ['DYNAMIC', 'STATIC'],
    default: 'STATIC'
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE']
  },
  merchant_id: {
    type: String,
    ref: 'Merchant',
    default: null
  }
})

module.exports = mongoose.model('QrCode', qrSchema)
