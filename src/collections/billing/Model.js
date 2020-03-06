const mongoose = require('mongoose')
const Joi = require('@hapi/joi')

const billSchema = new mongoose.Schema({
  bill_id: {
    type: String
  },
  amount: {
    type: Number
  },
  created_at: {
    type: String
  },
  updated_at: {
    type: String
  }
})

billSchema.statics.validation = (args) => {
  const schema = Joi.object({
    user_id: Joi.string(),
    amount: Joi.number().required().greater(0)
  })

  return schema.validate(args)
}

module.exports = mongoose.model('Billing', billSchema)