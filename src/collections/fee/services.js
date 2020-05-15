// Model
const Fee = require('./Model')
const Merchant = require('../merchant/Model')

// services
const { generateID, generateRandomString, getUnixTime } = require('../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../utils/constants/number')
const { checkerValidMerchant } = require('../merchant/services')

const createFeeService = async (fixFee, percentageFee, actionTo, transactionMethod) => {
  try {
    const fee = new Fee({
      fee_id: generateID(RANDOM_STRING_FOR_CONCAT),
      fix_fee_amount: fixFee,
      percentage_fee_amount: percentageFee,
      action_to: actionTo,
      transaction_method: transactionMethod,
      fee_master_code: generateRandomString(8),
      created_at: getUnixTime(),
      updated_at: getUnixTime()
    })

    await fee.save()

    return { status: 200, success: 'Successfully Save Fee' }
  } catch (err) {
    return { status: 400, error: 'Failed Saving Fee' }
  }
}

const setMerchantSchemaFee = async (merchantID, operatorFeeCode, institutionFeeCode) => {
  try {
    // check if merchant valid
    await checkerValidMerchant(merchantID)

    // check operator fee code
    const validOperatorFee = await Fee.findOne({ action_to: 'operator', fee_master_code: operatorFeeCode })
    if (!validOperatorFee) {
      return { status: 400, error: 'Invalid Operator Fee Code' }
    }

    // check institution fee code
    const validInstitutionFee = await Fee.findOne({ action_to: 'institution', fee_master_code: institutionFeeCode })
    if (!validInstitutionFee) {
      return { status: 400, error: 'Invalid Institution Fee Code' }
    }

    const feeMasterCode = {
      operator_code: operatorFeeCode,
      institution_code: institutionFeeCode
    }

    await Merchant.updateOne({ merchant_id: merchantID }, { fee_master_code: feeMasterCode })

    return { status: 200, success: 'Successfully Set Merchant Schema Fee' }
  } catch (err) {
    return { status: 400, error: 'Failed Set Merchant Schema Fee' }
  }
}

const checkerValidFeeMasterCode = async (feeMasterCode) => {
  try {
    const fee = await Fee.findOne({ fee_master_code: feeMasterCode })
    if (!fee) {
      throw new Error('Invalid Fee Code')
    }
    return true
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = {
  createFeeService,
  setMerchantSchemaFee,
  checkerValidFeeMasterCode
}
