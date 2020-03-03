const Emoney = require('./Model')

const addTransaction = async (userID, transactionID, billID, transactionAmount, saldo, type) => {
  if (!userID || !transactionID || !billID || !transactionAmount || !saldo || !type) return { status: 400, error: 'Field cannot be empty' }

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

const getAllTransaction = () => {
  return Emoney.find()
  
}

module.exports.addTransaction = addTransaction
module.exports.getAllTransaction = getAllTransaction
