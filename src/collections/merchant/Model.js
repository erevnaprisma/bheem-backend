const mongoose = require('mongoose')
require('mongoose-type-email')
const bcrypt = require('bcrypt')
const Joi = require('@hapi/joi')

const merchantSchema = new mongoose.Schema({
  email: {
    type: mongoose.SchemaTypes.Email,
    unique: true
  },
  username: {
    type: String
  },
  password: {
    type: String,
    min: 5,
    max: 15
  },
  device_id: {
    type: String,
    min: 2
  }
})

merchantSchema.pre('save', function (next) {
  const user = this
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err)
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err)
      }
      user.password = hash
      next()
    })
  })
})

merchantSchema.statics.validation = (args) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    device_id: Joi.string().min(2).required()
  })

  return schema.validate(args)
}

module.exports = mongoose.model('Merchant', merchantSchema)
