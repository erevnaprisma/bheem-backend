const jwt = require('jsonwebtoken')
const config = require('config')

const Merchant = require('./Model')
const { sendMailVerification, generateRandomStringAndNumber } = require('../../utils/services/supportServices')
const { generateID } = require('../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../utils/constants/number')

const addMerchantAccount = async (email, deviceID) => {
  const { error } = Merchant.validation({ email, device_id: deviceID })
  if (error) return { status: 400, error: error.details[0].message }

  const checkerValidEmail = await Merchant.findOne({ email })
  if (!checkerValidEmail) return { status: 400, error: 'Email already used' }

  let user = await new Merchant({
    merchant_id: generateID(RANDOM_STRING_FOR_CONCAT),
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

const checkerValidMerchant = async (MerchantID) => {
  if (!MerchantID) throw new Error('Invalid Merchant ID')

  const res = await Merchant.findOne({ merchant_id: MerchantID })
  if (!res) throw new Error('Invalid Merchant ID')
}

module.exports.addMerchantAccount = addMerchantAccount
module.exports.checkerValidMerchant = checkerValidMerchant
