const { sendMailVerification } = require('../../utils/services/supportServices')
const { userChangesValidation } = require('../user/services')
const { generateRandomNumber } = require('../../utils/services/supportServices')
const { generateID } = require('../../utils/services/supportServices')
const { checkerValidUser } = require('../user/services')
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
      created_at: Date.now(),
      updated_at: Date.now()
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

  var otp

  await checkerValidUser(userID)
  try {
    // Check if otp is on database using otp number
    const res = await Otp.findOne({ otp_number: otp })

    if (!res) {
      // Check otp using user id
      otp = await Otp.findOne({ user_id: userID, status: 'ACTIVE' })
      console.log(otp)
      if (!otp) {
        throw new Error('Invalid otp')
      } else {
        if (otp.status === 'ACTIVE') {
          if (otp.isValidLimit >= 3) {
            await Otp.updateOne({ user_id: userID }, { status: 'INACTIVE' })
            return { status: 400, error: 'Otp expired' }
          } else {
            console.log('sampe sini')
            const res = await Otp.updateOne({ user_id: userID, states: 'ACTIVE' }, { isValidLimit: otp.isValidLimit + 1 })
            return { status: 400, error: 'Invalid otp' }
          }
        } else {
          return { status: 400, error: 'Otp expired' }
        }
      }
    }

    console.log(res.created_at)

    await User.updateOne({ user_id: userID }, { email: newEmail, status: 'INACTIVE' })
    return { status: 200, success: 'successfully change email' }
  } catch (err) {
    return { status: 400, error: err || 'Submit otp failed' }
  }
}

module.exports.sendOTPService = sendOTPService
module.exports.submitOtpService = submitOtpService
