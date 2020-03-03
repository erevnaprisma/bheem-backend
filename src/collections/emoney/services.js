const Emoney = require('./Model')

const addTransaction = async (userID, transactionID, billID, transactionAmount, saldo, type) => {
  // if(!user_id || !transaction_id || !bill_id || !transaction_amount || !saldo || !tipe) return { status: 400, error: 'Field cannot be empty' }

  const res = await new Emoney({
    user_id: userID,
    transaction_id: transactionID,
    bill_id: billID,
    transaction_amount: transactionAmount,
    saldo,
    type
  })

  try {
    res.save()

    return { status: 200, success: 'transaction success' }
  } catch (err) {
    return { status: 400, error: 'transaction failed' }
  }
}

const getAllTransaction = async () => {
  try {
    const transaction = await Emoney.find()

    return { status: 200, success: 'Get transaction success', transaction }
  } catch (err) {
    return { status: 400, error: 'Error getting transaction' }
  }
}

module.exports.addTransaction = addTransaction
module.exports.getAllTransaction = getAllTransaction
