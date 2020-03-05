const Transaction = require('./Model')

const addUserTransaction = async (bill, amount, userID) => {
  let transaction = await new Transaction({
    billing_id: bill,
    transaction_amount: amount,
    user_id: userID
  })

  transaction = await transaction.save()

  return transaction
}
module.exports.addUserTransaction = addUserTransaction
