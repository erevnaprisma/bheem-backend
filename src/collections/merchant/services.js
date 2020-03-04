const Merchant = require('./Model')
const { sendMailVerification, generateRandomStringAndNumber } = require('../../utils/supportServices')
const jwt = require('jsonwebtoken')
const config = require('config')

const addMerchantAccount = async (email, deviceID) => {
  if (!email) return { status: 400, error: 'Invalid email' }
  if (!deviceID) return { status: 400, error: 'Invalid device_id' }

  const { error } = Merchant.validation({ email, device_id: deviceID })
  if (error) return { status: 400, error: error.details[0].message }

  let user = await new Merchant({
    email,
    device_id: deviceID,
    username: generateRandomStringAndNumber(8),
    password: generateRandomStringAndNumber(6)
  })

  const localPassword = user.password
  try {
    user = await user.save()

    const accessToken = await jwt.sign({ user_id: user._id }, config.get('privateKey'), { expiresIn: '30min' })

    user.password = localPassword

    await sendMailVerification(user)

    return { status: 200, success: 'Add merchant success', access_token: accessToken }
  } catch (err) {
    return { status: 400, error: err }
  }
}

module.exports.addMerchantAccount = addMerchantAccount
