const jwt = require('jsonwebtoken')
const config = require('config')

// model
const Merchant = require('./Model')
const Blacklist = require('../blacklist/Model')
const { serviceAddBlacklist } = require('../blacklist/services')

// services & constants
const { sendMailVerification, generateRandomStringAndNumber, generateRandomNumber, getUnixTime } = require('../../utils/services/supportServices')
const { generateID, Response } = require('../../utils/services/supportServices')
const word = require('../../utils/constants/word')
const number = require('../../utils/constants/number')

const addMerchantService = async (email, deviceID) => {
  // joi validation
  const { error } = Merchant.validation({ email, device_id: deviceID })
  if (error) return Response({ statusCode: number.STATUS_CODE_FAIL, errorMessage: error.details[0].message })

  // null input checker
  if (!email) return Response({ statusCode: number.STATUS_CODE_FAIL, errorMessage: word.INVALID_EMAIL })
  if (!deviceID) return Response({ statusCode: number.STATUS_CODE_FAIL, errorMessage: word.INVALID_DEVICE_ID })

  // check if email already in used
  const isUsed = await Merchant.findOne({ email })
  if (isUsed) return Response({ statusCode: number.STATUS_CODE_FAIL, errorMessage: word.IS_USED_EMAIL })

  const model = {
    type: 'merchantSignup',
    password: generateRandomNumber(number.PASSWORD),
    email
  }

  // sending email to merchant
  await sendMailVerification(model)

  try {
    // save new merchant to db
    const merchant = new Merchant({
      merchant_id: generateID(),
      email,
      device_id: deviceID,
      username: generateRandomStringAndNumber(number.USERNAME),
      password: model.password,
      created_at: getUnixTime(),
      updated_at: getUnixTime()
    })

    await merchant.save()

    return { status: number.STATUS_CODE_SUCCESS, success: word.CHECK_EMAIL }
  } catch (err) {
    return { status: number.STATUS_CODE_SUCCESS, error: err !== null || err !== undefined ? err : word.FAILED_SIGN_UP }
  }
}

const loginService = async (email, password, token, isLoggedInWithToken) => {
  const checkerToken = await Blacklist.findOne({ token })
  if (checkerToken) return { status: 400, error: 'Token already expired' }

  // login with token
  if (isLoggedInWithToken) {
    return { status: 200, success: word.WORD_LOGIN_MERCHANT }
  }

  // null input checker
  if (!email || !password) return Response({ statusCode: number.STATUS_CODE_FAIL, errorMessage: word.CANNOT_EMPTY })

  // joi validation
  const { error } = Merchant.validation({ email, password })
  if (error) return Response({ statusCode: number.STATUS_CODE_FAIL, errorMessage: error.details[0].message })

  try {
    // check if merchant exist
    const merchant = await Merchant.findOne({ email })
    if (!merchant) return Response({ statusCode: number.STATUS_CODE_FAIL, errorMessage: word.MERCHANT_ID_NOT_FOUND })

    await merchant.comparedPassword(password)

    // create access token
    const accessToken = await jwt.sign({ merchant: merchant.merchant_id }, config.get('privateKey'), { expiresIn: '30min' })

    return { status: number.STATUS_CODE_SUCCESS, success: word.MERCHANT_LOGIN_SUCCESS, access_token: accessToken, merchant_id: merchant.merchant_id }
  } catch (err) {
    return Response({ statusCode: number.STATUS_CODE_FAIL, error: word.MERCHANT_LOGIN_FAILED })
  }
}

const getMerchantInfoService = async (merchantID) => {
  if (!merchantID) return Response({ statusCode: number.STATUS_CODE_FAIL, errorMessage: word.MERCHANT_INVALID_ID })

  try {
    // check if merchant exist
    const merchant = await Merchant.findOne({ merchant_id: merchantID })
    console.log(merchant)
    if (!merchant) return Response({ statusCode: number.STATUS_CODE_FAIL, errorMessage: word.MERCHANT_ID_NOT_FOUND })

    return { status: 200, success: word.MERCHANT_GET_SUCCESS, merchant }
  } catch (err) {
    return Response({ statusCode: number.STATUS_CODE_FAIL, errorMessage: word.MERCHANT_ID_NOT_FOUND })
  }
}

const checkerValidMerchant = async (MerchantID) => {
  if (!MerchantID) throw new Error('Invalid Merchant ID')

  const res = await Merchant.findOne({ merchant_id: MerchantID })
  if (!res) throw new Error('Invalid Merchant ID')
}

const getAllMerchantService = async () => {
  try {
    const merchant = await Merchant.find()
    return { status: 200, success: 'Successfully get all merchant', merchant }
  } catch (err) {
    return { status: 400, error: 'Failed get all Merchant' }
  }
}

const serviceLogout = async (token) => {
  if (!token) return { status: 400, error: 'Invalid token' }

  try {
    await serviceAddBlacklist(token)
    return { status: 200, success: 'Successfully logout' }
  } catch (err) {
    return { status: 400, success: err }
  }
}

module.exports.addMerchantService = addMerchantService
module.exports.checkerValidMerchant = checkerValidMerchant
module.exports.getAllMerchantService = getAllMerchantService
module.exports.loginService = loginService
module.exports.getMerchantInfoService = getMerchantInfoService
module.exports.serviceLogout = serviceLogout
