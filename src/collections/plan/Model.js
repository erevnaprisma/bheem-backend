const mongoose = require('mongoose')
const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  minutes: String,
  participants: Number,
  createdAt: {
    type: String
  },
  updatedAt: {
    type: String
  }
})

planSchema.statics.validate = (args) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(20).required(),
    minutes: Joi.string().required(),
    participants: Joi.number().min(1).required()
  })

  return schema.validate(args)
}

module.exports = mongoose.model('Plan', planSchema)
