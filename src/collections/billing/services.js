const Billing = require('./Model')
const { generateID, getUnixTime } = require('../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../utils/constants/number')

const addBillingService = async (args) => {
  const { error } = Billing.validation(args)
  if (error) return { status: 400, error: error.details[0].message }

  if (!args.amount) return { status: 400, error: 'Invalid amount' }

  try {
    let bill = await new Billing({
      amount: args.amount,
      bill_id: generateID(RANDOM_STRING_FOR_CONCAT),
      created_at: getUnixTime(),
      updated_at: getUnixTime()
    })
    bill = await bill.save()

    return bill
  } catch (err) {
    return { status: 400, error: err }
  }
}

module.exports.addBillingService = addBillingService
