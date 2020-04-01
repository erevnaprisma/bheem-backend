const randomString = require('randomstring')
const nodemailer = require('nodemailer')
const config = require('config')

const { RANDOM_STRING_FOR_CONCAT } = require('../constants/number')

const generateRandomStringAndNumber = (length) => {
  return randomString.generate({
    length
  })
}

const generateRandomString = (length) => {
  return randomString.generate({
    length,
    charset: 'alphabetic'
  })
}

const generateRandomNumber = (length) => {
  return randomString.generate({
    length,
    charset: 'numeric'
  })
}

const sendMailVerification = async (model) => {
  var mailOptions

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
      user: config.get('mongoDB.email'),
      pass: config.get('mongoDB.password')
    }
  })
  if (model.type === 'otp') {
    mailOptions = {
      from: config.get('mongoDB.email'),
      to: model.email,
      subject: 'RayaPay',
      text: `Your OTP is ${model.otp}`
    }
  }
  if (model.type === 'signup') {
    mailOptions = {
      from: config.get('mongoDB.email'),
      to: model.email,
      subject: 'RayaPay',
      text: `Thank you for applying on RayaPay. We are looking forward for your action in changing your name and password.
          name: ${model.username}
          password: ${model.password}`
    }
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (err) {
    throw new Error(err)
  }
}

const generateID = () => {
  return new Date().getTime() + generateRandomString(RANDOM_STRING_FOR_CONCAT)
}

const getUnixTime = () => {
  return new Date().getTime()
}

module.exports.generateRandomStringAndNumber = generateRandomStringAndNumber
module.exports.generateRandomString = generateRandomString
module.exports.generateRandomNumber = generateRandomNumber
module.exports.sendMailVerification = sendMailVerification
module.exports.generateID = generateID
module.exports.getUnixTime = getUnixTime
