const mongoose = require('mongoose')
const Joi = require('joi')

const otpSchema = new mongoose.Schema({
  otp_id: {
    type: String
  },
  otp_number: {
    type: String
  },
  otp_reference_number: {
    type: String,
    min: 5
  },
  new_email: {
    type: String
  },
  type: {
    type: String,
    enum: ['FORGET PASSWORD', 'CHANGE EMAIL'],
    default: 'CHANGE EMAIL'
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

otpSchema.statics.validation = (args) => {
  const schema = Joi.object({
    user_id: Joi.string(),
    email: Joi.string().email()
  })

  return schema.validate(args)
}

module.exports = mongoose.model('OTP', otpSchema)
