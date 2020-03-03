const randomString = require('randomstring')
const nodemailer = require('nodemailer')
const config = require('config')

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

const sendMailVerification = async (model) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
      user: config.get('mongoDB.email'),
      pass: config.get('mongoDB.password')
    }
  })

  const mailOptions = {
    from: config.get('mongoDB.email'),
    to: model.email,
    subject: 'RayaPay',
    text: `Thank you for applying on RayaPay. We are looking forward for your action in changing your name and password.
        name: ${model.username}
        password: ${model.password}`
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

module.exports.generateRandomStringAndNumber = generateRandomStringAndNumber
module.exports.generateRandomString = generateRandomString
module.exports.sendMailVerification = sendMailVerification
