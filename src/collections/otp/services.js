const { sendMailVerification } = require('../../utils/services/supportServices')
const { userChangesValidation } = require('../user/services')
const { generateRandomNumber } = require('../../utils/services/supportServices')
const { generateID } = require('../../utils/services/supportServices')
const { checkerValidUser } = require('../user/services')
const { RANDOM_STRING_FOR_CONCAT } = require('../../utils/constants/number')

const Otp = require('./Model')
const User = require('../user/Model')

const sendOTPService = async ({ userID, password, email }) => {
  if (!password) return { status: 400, error: 'Invalid password' }
  if (!email) return { status: 400, error: 'Invalid email' }

  // Check email format
  const { error } = Otp.validation({ email })
  if (error) return { status: 400, error: error.details[0].message }

  // Check if user valid
  await checkerValidUser(userID)

  // Check if email already exist
  const emailAlreadyUsed = await User.findOne({ email: email })
  if (emailAlreadyUsed) return { status: 400, error: 'Email already used' }

  const res = await Otp.findOne({ user_id: userID, status: 'ACTIVE' })
  if (res) {
    const res2 = await expireOtpChecker({ getOtpTime: res.created_at.getTime(), otp: res.otp })
    if (res2) return { status: 400, error: 'We already sent your otp, please do check your email' }
  }

  try {
    await userChangesValidation({ password, userID: userID })

    const otp = generateRandomNumber(6)
    const otpRefNum = generateRandomNumber(6)

    const res = await new Otp({
      otp_id: generateID(RANDOM_STRING_FOR_CONCAT),
      otp_number: otp,
      otp_reference_number: otpRefNum,
      user_id: userID,
      new_email: email,
      created_at: new Date(),
      updated_at: new Date()
    })

    await res.save()

    await sendMailVerification({ email: email, type: 'otp', otp })

    return { status: 200, success: 'Please do check your email', otpRefNum: res.otp_reference_number }
  } catch (err) {
    return { status: 400, error: err || 'Otp failed' }
  }
}

const submitOtpService = async ({ otp, email, userID, otpRefNum }) => {
  if (!otp) return { status: 400, error: 'Invalid otp' }
  if (!email) return { status: 400, error: 'Invalid email' }
  if (!userID) return { status: 400, error: 'Invalid user id' }

  await checkerValidUser(userID)

  var otp

  try {
    // Check if otp is on database using otp number
    const res = await Otp.findOne({ otp_number: otp })

    if (otpRefNum !== res.otp_reference_number) return { status: 400, error: 'Otp reference number is invalid'}

    if (!res) {
      // Check otp using user id
      otp = await Otp.findOne({ user_id: userID, status: 'ACTIVE' })
      if (!otp) {
        throw new Error('Invalid otp')
      } else {
        if (otp.status === 'ACTIVE') {
          if (otp.isValidLimit >= 3) {
            await Otp.updateOne({ user_id: userID, status: 'ACTIVE' }, { status: 'INACTIVE' })
            return { status: 400, error: 'Otp expired' }
          } else {
            await Otp.updateOne({ user_id: userID, status: 'ACTIVE' }, { isValidLimit: otp.isValidLimit + 1 })
            return { status: 400, error: 'Invalid otp' }
          }
        } else {
          return { status: 400, error: 'Otp expired' }
        }
      }
    }

    // Check if otp already expired or not
    const otpCreateAt = res.created_at.getTime()
    await expireOtpChecker({ getOtpTime: otpCreateAt, otp })

    // Check if otp above time limit
    // const getOtpTime = res.created_at.getTime()
    // const maxDate = getOtpTime + maximumTime

    await Otp.updateOne({ otp_number: otp }, { status: 'INACTIVE' })
    await User.updateOne({ user_id: userID }, { email: email })
    return { status: 200, success: 'successfully change email' }
  } catch (err) {
    return { status: 400, error: err || 'Submit otp failed' }
  }
}

const expireOtpChecker = async ({ getOtpTime, otp }) => {
  const maximumTime = 900000

  // Check if otp above time limit
  const maxDate = getOtpTime + maximumTime
  console.log('date now= ' + Date.now())
  console.log('max date= ' + maxDate)

  console.log('benar ato salah jamnya= ' + Date.now() > maxDate)
  if (Date.now() > maxDate) {
    await Otp.updateOne({ otp_number: otp }, { status: 'INACTIVE' })
    throw new Error('Otp expired')
  }
  return true
}

module.exports.sendOTPService = sendOTPService
module.exports.submitOtpService = submitOtpService
