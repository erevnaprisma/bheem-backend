const Transaction = require('./Model')

const addUserTransaction = async (args) => {
  if (!args.amount_transaction) return { status: 400, error: 'Invalid amount_transaction' }
  if (!args.merchant_id) return { status: 400, error: 'Invalid merchant_id' }

  const transaction = await new Transaction({
    amountTransaction: args.amount_transaction,
    merchant_id: args.merchant_id
  })
  try {
    await transaction.save()
    return { status: 200, success: 'Transaction successfully saved' }
  } catch (err) {
    return { status: 400, error: 'Fail saving transaction' }
  }
}
module.exports.addUserTransaction = addUserTransaction
