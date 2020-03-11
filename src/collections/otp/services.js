const { sendMailVerification } = require('../../utils/services/supportServices')
const { userChangesValidation } = require('../user/services')
const { generateRandomNumber } = require('../../utils/services/supportServices')
const { generateID } = require('../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../utils/constants/number')

const Otp = require('./Model')
const User = require('../user/Model')

const sendOTPService = async ({ userID, password, newEmail }) => {
  try {
    await userChangesValidation({ password, userID: userID })

    const otp = generateRandomNumber(6)

    await sendMailVerification({ email: newEmail, type: 'otp', otp })

    const res = await new Otp({
      otp_id: generateID(RANDOM_STRING_FOR_CONCAT),
      otp_number: otp,
      user_id: userID,
      new_email: newEmail,
      created_at: new Date(),
      updated_at: new Date()
    })

    await res.save()

    return { status: 200, success: 'Please do check your email' }
  } catch (err) {
    return { status: 400, error: err || 'Otp failed' }
  }
}

const submitOtpService = async ({ otp, newEmail, userID }) => {
  console.log('otp', typeof otp)
  if (!otp) return { status: 400, error: 'Invalid otp' }
  if (!newEmail) return { status: 400, error: 'Invalid email' }
  if (!userID) return { status: 400, error: 'Invalid user id' }
  try {
    const res = await Otp.findOne({ otp_number: otp })
    console.log(res)
    if (!res) return { status: 400, error: 'Invalid otp' }

    await User.updateOne({ user_id: userID }, { email: newEmail })
    return { status: 200, success: 'successfully change email' }
  } catch (err) {
    return { status: 400, error: err || 'Submit otp failed' }
  }
}

module.exports.sendOTPService = sendOTPService
module.exports.submitOtpService = submitOtpService
