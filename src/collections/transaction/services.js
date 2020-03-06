const Transaction = require('./Model')
const { generateID, getUnixTime } = require('../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../utils/constants/number')

const addUserTransaction = async (bill, amount, userID) => {
  const { error } = Transaction.validation({ user_id: userID, transaction_amount: amount, billing_id: bill })
  if (error) return { status: 400, error: error.details[0].message }

  let transaction = await new Transaction({
    billing_id: bill,
    transaction_amount: amount,
    user_id: userID,
    transaction_id: generateID(RANDOM_STRING_FOR_CONCAT),
    created_at: getUnixTime(),
    updated_at: getUnixTime()
  })

  transaction = await transaction.save()

  return transaction
}
module.exports.addUserTransaction = addUserTransaction
