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

const setMerchantSchemaFee = async (merchantID, operatorFeeCode, institutionFeeCode, feeMethod) => {
  try {
    // check if merchant valid
    await checkerValidMerchant(merchantID)

    // check operator fee code
    const validOperatorFee = await Fee.findOne({ action_to: 'operator', fee_master_code: operatorFeeCode, transaction_method: feeMethod })
    if (!validOperatorFee) {
      return { status: 400, error: 'Invalid Operator Fee Code' }
    }

    // check institution fee code
    const validInstitutionFee = await Fee.findOne({ action_to: 'institution', fee_master_code: institutionFeeCode, transaction_method: feeMethod })
    if (!validInstitutionFee) {
      return { status: 400, error: 'Invalid Institution Fee Code' }
    }

    // assign feeMasterCode for merchant based on fee method
    var feeMasterCode

    if (feeMethod === 'Top-up') {
      feeMasterCode = {
        operator_code_topup: operatorFeeCode,
        institution_code_topup: institutionFeeCode
      }
    }

    if (feeMethod === 'E-money') {
      feeMasterCode = {
        operator_code_emoney: operatorFeeCode,
        institution_code_emoney: institutionFeeCode
      }
    }

    const { fee_master_code: currentFeeMasterCode } = await Merchant.findOne({ merchant_id: merchantID })

    // if current fee master code is null or undefined
    if (!currentFeeMasterCode) {
      await Merchant.updateOne({ merchant_id: merchantID }, { fee_master_code: feeMasterCode })
      return { status: 200, success: 'Successfully Set Merchant Schema Fee' }
    }
    
    await Merchant.updateOne({ merchant_id: merchantID }, { fee_master_code: Object.assign(currentFeeMasterCode, feeMasterCode) })

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
