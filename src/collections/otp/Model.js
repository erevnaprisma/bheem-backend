const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
  otp_id: {
    type: String
  },
  otp_number: {
    type: String
  },
  new_email: {
    type: String
  },
  created_at: {
    type: Date
  },
  updated_at: {
    type: Date
  },
  user_id: {
    type: String
  },
  isValidLimit: {
    type: Number,
    max: 3,
    default: 0
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
  }
})

module.exports = mongoose.model('OTP', otpSchema)
