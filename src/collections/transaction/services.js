const Transaction = require('./Model')

const addUserTransaction = async (args) => {
  if (!args.transaction_amount) return { status: 400, error: 'Invalid transaction amount' }
  if (!args.merchant_id) return { status: 400, error: 'Invalid merchant id' }

  const res = await new Transaction({
    transaction_amount: args.transaction_amount,
    merchant_id: args.merchant_id
  })
  try {
    await res.save()
    return { status: 200, success: 'Transaction successfully saved' }
  } catch (err) {
    return { status: 400, error: err || 'Fail saving transaction' }
  }
}
module.exports.addUserTransaction = addUserTransaction
