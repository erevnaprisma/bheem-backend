const randomstring = require('randomstring')
const nodemailer = require('nodemailer')
const config = require('config')

const generateRandomString = async (length) => {
  return randomstring.generate({
    length,
    charset: 'alphabetic'
  })
}

const generateRandomNumber = async (length) => {
  return randomstring.generate({
    length,
    charset: 'numeric'
  })
}

const generateId = () => {
  return new Date().getTime() + generateRandomString(5)
}

const sendMail = async model => {
  var mailOptions

  var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: config.get('devEmail'),
      pass: config.get('devPassword')
    }
  }

  const transporter = nodemailer.createTransport(smtpConfig)

  if (model.type === 'signup') {
    mailOptions = {
      from: config.get('devEmail'),
      to: model.email,
      subject: 'Bheem',
      text: `Thank you for applying to Bheem. We are looking forward for your action in changing your name and password.
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

module.exports = {
  generateRandomString,
  generateRandomNumber,
  generateId,
  sendMail
}
