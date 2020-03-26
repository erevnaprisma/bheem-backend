const Transaction = require('../../collections/transaction/Model')
const { checkerValidUser } = require('../../collections/user/services')

const transactionHistory = async (id) => {
  await checkerValidUser(id)

  try {
    const transaction = await Transaction.find({ user_id: id })
    if (!transaction) return { status: 400, error: 'No Transaction' }

    return { status: 200, success: 'Successfully get Transaction History', transaction_history: transaction }
  } catch (err) {
    return {
      status: 400,
      error: err || 'Failed get Transaction History'
    }
  }
}

module.exports = transactionHistory
