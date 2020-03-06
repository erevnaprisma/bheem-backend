const mongoose = require('mongoose')
const Joi = require('@hapi/joi')

const User = require('../user/Model')

const saldoSchema = new mongoose.Schema({
  saldo_id: {
    type: String
  },
  saldo: {
    type: Number,
    default: 0
  },
  user_id: {
    type: String,
    ref: User
  },
  created_at: {
    type: String
  },
  updated_at: {
    type: String
  }
})

saldoSchema.statics.validation = (args) => {
  const schema = Joi.object({
    user_id: Joi.string().required(),
    saldo: Joi.number().required()
  })

  return schema.validate(args)
}

module.exports = mongoose.model('Saldo', saldoSchema)
