const Fee = require('./Model')
const { generateID, generateRandomString, getUnixTime } = require('../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../utils/constants/number')

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

module.exports = {
  createFeeService
}
