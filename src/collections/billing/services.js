const Billing = require('./Model')
const { generateID, getUnixTime } = require('../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../utils/constants/number')

const addBillingService = async (amount) => {
  try {
    let bill = await new Billing({
      bill_id: generateID(RANDOM_STRING_FOR_CONCAT),
      amount,
      created_at: getUnixTime(),
      updated_at: getUnixTime()
    })
    bill = await bill.save()

    return bill
  } catch (err) {
    return { status: 400, error: err }
  }
}

const updateBillingAmount = () => {
  console.log('update')
}

module.exports.addBillingService = addBillingService
module.exports.updateBillingAmount = updateBillingAmount
