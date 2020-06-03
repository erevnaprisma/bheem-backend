// Models
const User = require('./Model')
const Blacklist = require('../blacklist/Model')
const config = require('config')

// Services
const jwt = require('jsonwebtoken')

// Utils
const {
  generateId,
  generateRandomString,
  generateRandomNumber,
  sendMail
} = require('../../utils/services')

const loginService = async (email, password, { req, res }) => {
  try {
    if (!email) throw new Error('Invalid email')
    if (!password) throw new Error('Invalid password')

    const { error } = await User.validate({ email, password })
    if (error) throw new Error(error.details[0].message)

    // check if user exist
    const user = await User.findOne({ email })
    if (!user) throw new Error('Invalid email')

    // check password
    await User.comparePassword(password, user.password)

    // generate token with expiry date 3 hours
    const token = await jwt.sign({ userId: user.user_id, user: true, exp: 10800 }, config.get('privateKey'))

    // set authorization in header
    await res.header({ Authorization: token })

    return { status: 200, success: 'Welcome to Bheem', user }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed login' }
  }
}

const logoutService = async (token) => {
  try {
    if (!token) throw new Error('Invalid token')

    const blacklist = await new Blacklist({
      token,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    })

    await blacklist.save()

    return { status: 200, success: 'Successfully logout' }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed logout' }
  }
}

const signUpService = async (email, deviceId) => {
  try {
    if (!email) throw new Error('Invalid email')
    if (!deviceId) throw new Error('Invalid deviceId')

    const { error } = await User.validate({ email, deviceId })
    if (error) throw new Error(error.details[0].message)

    const model = {
      username: await generateRandomString(4),
      password: await generateRandomNumber(4),
      email,
      type: 'signup'
    }

    const user = await new User({
      userId: await generateId(),
      username: model.username,
      email,
      password: model.password,
      deviceId,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    })

    await user.save()

    // send email to user
    await sendMail(model)

    return { status: 200, success: 'We send your password to your email' }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed sign up' }
  }
}

const getAllUserService = async () => {
  try {
    const user = await User.find()
    return { status: 200, success: 'Successfully get all user', user }
  } catch (err) {
    return { status: 400, error: err.message || 'Failed get all user' }
  }
}

module.exports = {
  loginService,
  signUpService,
  logoutService,
  getAllUserService
}
