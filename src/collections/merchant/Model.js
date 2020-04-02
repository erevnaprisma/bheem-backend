const mongoose = require('mongoose')
require('mongoose-type-email')
const bcrypt = require('bcrypt')
const Joi = require('@hapi/joi')

const merchantSchema = new mongoose.Schema({
  merchant_id: {
    type: String
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    unique: true
  },
  username: {
    type: String,
    max: 25,
    min: 5
  },
  password: {
    type: String,
    min: 5,
    max: 15
  },
  device_id: {
    type: String,
    min: 2
  },
  address: {
    type: String,
    min: 6,
    max: 50,
    default: null
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
  var addRegex = /^[a-zA-Z0-9,.:/ ]*$/

  const schema = Joi.object({
    email: Joi.string().email().required(),
    device_id: Joi.string().min(2).required(),
    address: Joi.string().min(6).max(50).pattern(new RegExp(addRegex, 'm'))
  })

  return schema.validate(args)
}

module.exports = mongoose.model('Merchant', merchantSchema)
