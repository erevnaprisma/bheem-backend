const Transaction = require('./Model')
const { generateID, getUnixTime } = require('../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../utils/constants/number')

const addUserTransaction = async ({ bill, userID, qrID, amount }) => {
  const { error } = Transaction.validation({ user_id: userID, billing_id: bill })
  if (error) return { status: 400, error: error.details[0].message }

  let transaction = await new Transaction({
    billing_id: bill,
    user_id: userID,
    qr_id: qrID,
    transaction_amount: amount,
    transaction_id: generateID(RANDOM_STRING_FOR_CONCAT),
    created_at: getUnixTime(),
    updated_at: getUnixTime()
  })
  transaction = await transaction.save().catch((err) => { throw new Error(err) })

  return transaction
}

const getTransactionDetailService = async (transactionID) => {
  return Transaction.findOne({ transaction_id: transactionID })
}

module.exports.addUserTransaction = addUserTransaction
module.exports.getTransactionDetailService = getTransactionDetailService
