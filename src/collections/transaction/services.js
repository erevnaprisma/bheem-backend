const Transaction = require('./Model')

const addUserTransaction = async (bill, amount, userID) => {
  if (!bill) return { status: 400, error: 'Invalid billing id' }
  if (!amount) return { status: 400, error: 'Invalid amount' }
  if (!userID) return { status: 400, error: 'Invalid user id' }

  let transaction = await new Transaction({
    billing_id: bill,
    transaction_amount: amount,
    user_id: userID
  })

  transaction = await transaction.save()

  return transaction
}
module.exports.addUserTransaction = addUserTransaction
