const Transaction = require('./Model')
const { generateID, getUnixTime } = require('../../utils/services/supportServices')
const { RANDOM_STRING_FOR_CONCAT } = require('../../utils/constants/number')

const addUserTransaction = async ({ bill, userID, qrID, amount, merchantID }) => {
  const { error } = Transaction.validation({ user_id: userID, billing_id: bill })
  if (error) return { status: 400, error: error.details[0].message }

  let transaction = await new Transaction({
    billing_id: bill,
    user_id: userID,
    qr_id: qrID,
    merchant_id: merchantID,
    transaction_amount: amount,
    transaction_id: generateID(RANDOM_STRING_FOR_CONCAT),
    created_at: getUnixTime(),
    updated_at: getUnixTime()
  })
  transaction = await transaction.save().catch((err) => { throw new Error(err) })

  return transaction
}

const getTransaction = async (transactionID) => {
  const transaction = await Transaction.findOne({ transaction_id: transactionID })
  if (!transaction) throw new Error('Invalid Transaction Id')

  return transaction
}

const cancelTransaction = async (transactionID) => {
  return Transaction.updateOne({ transaction_id: transactionID }, { status: 'CANCEL' })
}

const transactionStatusPendingChecker = async (transactionID) => {
  const res = await getTransaction(transactionID)
  if (res) {
    if (res.status !== 'PNDNG') throw new Error('Transaction status is not pending anymore')
  }
}

const checkerValidTransaction = async (transactionID) => {
  if (!transactionID) throw new Error('Invalid Transaction ID')

  const res = await Transaction.findOne({ transaction_id: transactionID })
  if (!res) throw new Error('Invalid Transaction ID')
}

module.exports.addUserTransaction = addUserTransaction
module.exports.getTransaction = getTransaction
module.exports.cancelTransaction = cancelTransaction
module.exports.transactionStatusPendingChecker = transactionStatusPendingChecker
module.exports.checkerValidTransaction = checkerValidTransaction
