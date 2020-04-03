const Transaction = require('../../collections/transaction/Model')
const { checkerValidUser } = require('../../collections/user/services')

const transactionHistory = async (id) => {
  try {
    await checkerValidUser(id)

    const transaction = await Transaction.find({ user_id: id, status: 'SETLD' }).populate('merchant_id_native')
    if (!transaction) return { status: 400, error: 'No Transaction' }

    // add Merchant username to response
    transaction.forEach(e => {
      if (e.merchant_id_native) {
        if (e.transaction_method !== 'Top-up') {
          e.merchant_name = e.merchant_id_native.username
        } else {
          e.merchant_name = 'Virtual Account'
        }
      } else {
        if (e.transaction_method !== 'Top-up') {
          e.merchant_name = 'Erevna shop'
        } else {
          e.merchant_name = 'Virtual Account'
        }
      }
    })

    return { status: 200, success: 'Successfully get Transaction History', transaction_history: transaction }
  } catch (err) {
    return {
      status: 400,
      error: err || 'Failed get Transaction History'
    }
  }
}

module.exports = transactionHistory
