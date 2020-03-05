const mongoose = require('mongoose')
const Joi = require('joi')

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

billSchema.statics.validation = (args) => {
  const schema = Joi.object({
    user_id: Joi.string().required(),
    amount: Joi.number().required().greater(0)
  })

  return schema.validate(args)
}

module.exports = mongoose.model('Billing', billSchema)
