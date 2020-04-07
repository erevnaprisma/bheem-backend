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
    const res2 = await expireOtpChecker({ getOtpTime: res.created_at.getTime(), otp: res.otp_number })
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
      email,
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
    let res = await Otp.findOne({ otp_number: otp })
    if (res) {
      if (res.isValidLimit === 3) {
        res = null
      }
    }

    if (res) {
      if (res.status === 'INACTIVE') return { status: 400, error: 'Otp already expired' }
      if (res.new_email !== email) return { status: 400, error: 'New email not match' }
      if (otpRefNum !== res.otp_reference_number) return { status: 400, error: 'Otp reference number is invalid' }
    } else if (!res) {
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

const forgetPasswordSendOtpService = async (email) => {
  if (!email) return { status: 400, error: 'Invalid email' }

  const { error } = User.validation({ email })
  if (error) return { status: 400, error: error.details[0].message }

  try {
    const user = await User.findOne({ email })
    if (!user) return { status: 400, error: 'Email not found' }

    const model = {
      type: 'forgetPasswordSendOtp',
      email,
      otp: generateRandomNumber(4)
    }
    await sendMailVerification(model)

    const otp = await new Otp({
      status: 'ACTIVE',
      otp_number: model.otp,
      otp_id: generateID(RANDOM_STRING_FOR_CONCAT),
      otp_reference_number: generateRandomNumber(6),
      new_email: email,
      type: 'FORGET PASSWORD',
      created_at: new Date(),
      updated_at: new Date(),
      user_id: user.user_id
    })

    await otp.save()

    return { status: 200, success: 'Successfully send otp', otpRefNum: otp.otp_reference_number }
  } catch (err) {
    return { status: 400, error: 'Failed send new password' }
  }
}

const changePasswordViaForgetPasswordService = async (otp, password, email, otpRefNum) => {
  if (!otp) return { status: 400, error: 'Invalid otp' }
  if (!password) return { status: 400, error: 'Invalid password' }

  try {
    const otpChecker = await Otp.findOne({ otp_number: otp, status: 'ACTIVE', otp_reference_number: otpRefNum })
    if (!otpChecker) {
      const isEmailValid = await Otp.findOne({ email, status: 'ACTIVE' })
      if (isEmailValid) {
        if (isEmailValid.isValidLimit <= 2) {
          if (isEmailValid.isValidLimit >= 2) {
            await Otp.findOneAndUpdate({ email }, { status: 'INACTIVE' })
            return { status: 400, error: 'Otp expired' }
          }
          await Otp.findOneAndUpdatea({ email }, { isValidLimit: isEmailValid.isValidLimit + 1 })
          return { status: 400, error: 'Invalid otp' }
        } else {
          await Otp.findOneAndUpdate({ email }, { status: 'INACTIVE' })
          return { status: 400, error: 'Otp expired' }
        }
      } else {
        return { status: 400, error: 'Invalid otp' }
      }
    }

    const hashedPassword = await User.hashing(password)

    await User.findOneAndUpdate({ user_id: otpChecker.user_id }, { password: hashedPassword })

    await Otp.findOneAndUpdate({ otp_number: otp }, { status: 'INACTIVE' })

    return { status: 200, success: 'Successfully change password' }
  } catch (err) {
    return { status: 400, error: 'Failed change password' }
  }
}

const expireOtpChecker = async ({ getOtpTime, otp }) => {
  const maximumTime = 120000

  // Check if otp above time limit
  const maxDate = getOtpTime + maximumTime

  if (Date.now() > maxDate) {
    await Otp.updateOne({ otp_number: otp }, { status: 'INACTIVE' })
    return false
  }
  return true
}

module.exports.sendOTPService = sendOTPService
module.exports.submitOtpService = submitOtpService
module.exports.forgetPasswordSendOtpService = forgetPasswordSendOtpService
module.exports.changePasswordViaForgetPasswordService = changePasswordViaForgetPasswordService
