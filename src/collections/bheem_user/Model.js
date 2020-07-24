const mongoose = require('mongoose')
require('mongoose-type-email')
const Joi = require('@hapi/joi')
const bcrypt = require('bcrypt')

const bheemUserSchema = new mongoose.Schema({
  username: {
    type: String
  },
  fullName: {
    type: String
  },
  email: {
    type: mongoose.SchemaTypes.Email
  },
  password: {
    type: String
  },
  deviceId: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  nickname: {
    type: String
  },
  address: {
    type: String
  },
  profilePicture: {
    type: String
  },
  plan: {
    type: String,
    ref: 'Plan',
    enum: ['free', 'pro', 'business'],
    default: 'free'
  },
  createdAt: {
    type: String
  },
  updatedAt: {
    type: String
  }
})

bheemUserSchema.pre('save', function (next) {
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

bheemUserSchema.statics.comparePassword = async (password, userPassword) => {
  try {
    const isTrue = await bcrypt.compare(password, userPassword)
    if (!isTrue) throw new Error('Invalid password')
    return
  } catch (err) {
    throw new Error(err.message || 'Invalid Password')
  }
}

bheemUserSchema.statics.validate = (args) => {
  var regex = /^[a-z][a-z.\s-]{1,255}$/i
  var addRegex = /^[a-zA-Z0-9,.:/ ]*$/
  var passwordRegex = /^[a-zA-Z0-9]*$/i
  var usernameRegex = /^[a-zA-Z0-9]*$/i

  const schema = Joi.object({
    username: Joi.string().min(4).max(25).pattern(new RegExp(usernameRegex)),
    fullName: Joi.string().min(6).max(40).pattern(new RegExp(regex)),
    email: Joi.string().email(),
    password: Joi.string().min(4).max(15).pattern(new RegExp(passwordRegex)),
    deviceId: Joi.string().min(2),
    firstName: Joi.string().min(3).max(14).pattern(new RegExp(regex)),
    lastName: Joi.string().min(3).max(14).pattern(new RegExp(regex)),
    nickname: Joi.string().min(3).max(14).pattern(new RegExp(regex)),
    address: Joi.string().min(6).max(50).pattern(new RegExp(addRegex, 'm')),
    profilePicture: Joi.string()
  })

  return schema.validate(args)
}

module.exports = mongoose.model('BheemUser', bheemUserSchema)
